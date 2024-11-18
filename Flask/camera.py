from contextlib import contextmanager
from datetime import datetime
from flask import Flask, jsonify, Response, request, send_file
from flask_cors import CORS, cross_origin
from PIL import Image
from dotenv import load_dotenv
import gphoto2 as gp
import numpy as np
import cv2
import threading
import queue
import os
import logging
import time
import serial
import serial.tools.list_ports
import requests
import base64

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Globals
frame_queue = queue.Queue(maxsize=180)
LIVE_VIEW_ACTIVE = False
VIDEO_WRITER_ACTIVE = False
video_writer = None
video_lock = threading.Lock()
live_view_thread = None
print_amount = 1
check_coupon = 0
inserted_money = 0
amount_to_pay = 0
PREVIEW_INTERVAL = 0.0167  # 17ms between frames

class CameraManager:
    def __init__(self):
        self.lock = threading.Lock()
        self.camera = None
        self.context = None
        self.is_busy = False
        self.last_error_time = None
        self.error_count = 0
        self.MAX_ERRORS = 3
        self.ERROR_TIMEOUT = 300  # 5 minutes timeout after max errors
        self.frame_queue = frame_queue
        self.init_logging()
        self.initialize_camera()

    def init_logging(self):
        """Initialize gphoto2 logging callbacks"""
        def cb(level, domain, string, data=None):
            logging.debug(f'gphoto2 [{domain}] {string.strip()}')

        gp.use_python_logging()
        gp.check_result(gp.gp_log_add_func(gp.GP_LOG_DEBUG, cb))

    @contextmanager
    def camera_lock(self):
        """Thread-safe context manager for camera operations"""
        try:
            self.lock.acquire()
            self.is_busy = True
            yield
        finally:
            self.is_busy = False
            self.lock.release()
    
    def reset_error_state(self):
        """Reset error counter if timeout has passed"""
        if self.last_error_time and time.time() - self.last_error_time > self.ERROR_TIMEOUT:
            self.error_count = 0
            self.last_error_time = None
    
    def handle_error(self, error):
        """Handle camera errors with exponential backoff"""
        self.error_count += 1
        self.last_error_time = time.time()
        logging.error(f"Camera error: {str(error)}")

        if self.error_count >= self.MAX_ERRORS:
            logging.error("Maximum error count reached. Camera needs manual intervention.")
            return False
        return True

    def initialize_camera(self):
        """Initialize camera connection with error handling"""
        try:
            if self.camera is not None:
                self.camera.exit()
                self.camera = None

            if self.context is not None:
                self.context = None

            self.context = gp.Context()
            self.camera = gp.Camera()
            self.camera.init(self.context)

            # Configure capture target to internal RAM
            config = self.camera.get_config(self.context)
            capture_target = config.get_child_by_name('capturetarget')
            capture_target.set_value('Internal RAM')
            self.camera.set_config(config, self.context)

            return True

        except gp.GPhoto2Error as e:
            logging.error(f"Failed to initialize camera: {str(e)}")
            self.handle_error(e)
            return False
        
    def check_camera_ready(self):
        """Check if camera is responsive"""
        try:
            if self.camera is None:
                return self.initialize_camera()

            # Try to get camera summary as a simple test
            self.camera.get_summary(self.context)
            return True
        except gp.GPhoto2Error:
            return False

    def recover_camera(self):
        """Attempt to recover camera from error state"""
        logging.info("Attempting camera recovery...")

        try:
            if self.camera:
                self.camera.exit()
                self.camera = None

            if self.context:
                self.context = None

            time.sleep(2)
            return self.initialize_camera()

        except gp.GPhoto2Error as e:
            logging.error(f"Failed to recover camera: {str(e)}")
            return False

    def start_live_view(self):
        """Start live view."""
        global LIVE_VIEW_ACTIVE
        LIVE_VIEW_ACTIVE = True
        threading.Thread(target=self._enqueue_frames, daemon=True).start()

    def stop_live_view(self):
        """Stop live view."""
        global LIVE_VIEW_ACTIVE
        LIVE_VIEW_ACTIVE = False

    def _enqueue_frames(self):
        """Fetch frames for live view."""
        while LIVE_VIEW_ACTIVE:
            try:
                preview_file = self.camera.capture_preview(self.context)
                preview_data = preview_file.get_data_and_size()
                frame = cv2.imdecode(np.frombuffer(preview_data, np.uint8), cv2.IMREAD_COLOR)

                if self.frame_queue.full():
                    self.frame_queue.get()
                self.frame_queue.put(frame)

                if VIDEO_WRITER_ACTIVE:
                    self._write_video_frame(frame)

                time.sleep(PREVIEW_INTERVAL)
            except gp.GPhoto2Error as e:
                logging.error(f"Error in live view: {e}")
                continue
    
    def generate_frames(self):
        """Generate frames for live view."""
        while True:
            try:
                frame = self.frame_queue.get()
                _, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n\r\n')
            except queue.Empty:
                continue

    def _write_video_frame(self, frame):
        """Write frame to the video file."""
        global video_writer
        with video_lock:
            if video_writer is not None:
                video_writer.write(frame)

    def start_video_recording(self):
        """Start video recording."""
        global video_writer, VIDEO_WRITER_ACTIVE
        VIDEO_WRITER_ACTIVE = True
        filename = f"video_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4"
        filepath = os.path.join(os.getcwd(), filename)
        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        frame = self.frame_queue.queue[0] if not self.frame_queue.empty() else None

        if frame is not None:
            height, width, _ = frame.shape
            with video_lock:
                video_writer = cv2.VideoWriter(filepath, fourcc, 10, (width, height))

    def stop_video_recording(self):
        """Stop video recording."""
        global video_writer, VIDEO_WRITER_ACTIVE
        VIDEO_WRITER_ACTIVE = False
        with video_lock:
            if video_writer is not None:
                video_writer.release()
                video_writer = None

    def capture_image(self, uuid, retries=3):
        """Capture an image and save it as PNG."""
        global VIDEO_WRITER_ACTIVE
        self.stop_live_view()
        if self.error_count >= self.MAX_ERRORS and time.time() - self.last_error_time < self.ERROR_TIMEOUT:
            return {'status': 'error', 'message': 'Camera in recovery timeout'}

        self.reset_error_state()

        with self.camera_lock():
            for attempt in range(retries):
                try:
                    if not self.check_camera_ready():
                        if not self.recover_camera():
                            continue

                    # Prepare the file path
                    current_directory = os.path.dirname(os.path.abspath(__file__))
                    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
                    filename = os.path.join(current_directory, f'{uuid}/{date_str}.png')

                    # Ensure directory exists
                    os.makedirs(os.path.dirname(filename), exist_ok=True)

                    # Capture the image
                    logging.info("Capturing image...")
                    camera_path = self.camera.capture(gp.GP_CAPTURE_IMAGE, self.context)

                    # Download the image
                    logging.info("Downloading image...")
                    camera_file = self.camera.file_get(
                        camera_path.folder,
                        camera_path.name,
                        gp.GP_FILE_TYPE_NORMAL,
                        self.context
                    )

                    camera_file.save(filename)

                    # Verify file exists and has size
                    if os.path.exists(filename) and os.path.getsize(filename) > 0:
                        self.error_count = 0
                        self.start_live_view()
                        return {'status': 'success', 'file_saved_as': filename}
                    else:
                        raise Exception("Captured file is empty or missing")

                except gp.GPhoto2Error as e:
                    logging.error(f"GPhoto2 error during capture: {str(e)}")
                    if not self.handle_error(e):
                        break
                    self.recover_camera()
                except Exception as e:
                    logging.error(f"Unexpected error during capture: {str(e)}")
                    if not self.handle_error(e):
                        break
                    self.recover_camera()
                time.sleep(2 ** attempt)  # Exponential backoff
            self.start_live_view()
            return {'status': 'error', 'message': 'Failed to capture image after multiple attempts'}

# Flask endpoints
camera_manager = CameraManager()

# Find Arduino port
def find_arduino_port():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if 'Arduino' in p.description:
            return p.device
    return None

@app.route('/api/video_feed')
def video_feed():
    return Response(camera_manager.generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/start_live_view', methods=['GET'])
def start_live_view():
    if not LIVE_VIEW_ACTIVE:
        camera_manager.start_live_view()
        #camera_manager.start_video_recording()
    return jsonify(status="Live view and video recording started")

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view():
    camera_manager.stop_video_recording()
    camera_manager.stop_live_view()
    return jsonify(status="Live view and video recording stopped")

@app.route('/api/capture', methods=['POST'])
def capture_image():
    data = request.get_json()
    uuid = data.get('uuid', 'default_uuid')
    result = camera_manager.capture_image(uuid)
    return jsonify(result)

# Route to download a file
@app.route('/api/get_photo', methods=['GET'])
def download_file():
    # Assuming the files are stored in a specific directory on WSL
    uuid = request.args.get('uuid')
    if (not uuid):
        return jsonify({'status': 'error', 'message': 'No uuid'}), 200
    file_directory = os.path.join(os.path.dirname(os.path.abspath(__file__)),  uuid)
    try:
        file_list = os.listdir(file_directory)
        print("###########")
        print("file_list")
        print(file_list)
        print("###########")
        images = [file for file in file_list if file.lower().endswith(('.png', '.jpg'))]
        image_urls = [
            {
                'id': idx, 
                'url': f"http://{request.host}/api/get_photo/uploads"+os.path.join(f"/{uuid}", image.replace("\\","/"))
            } for idx, image in enumerate(sorted(images, key=lambda x: datetime.strptime(x.removesuffix('.png'), '%Y-%m-%d-%H-%M-%S')))
        ]
        videos = [file for file in file_list if file.lower().endswith(('.mp4'))]
        video_urls = [
            {
                'id': idx, 
                'url': f"http://{request.host}/api/get_photo/uploads"+os.path.join(f"/{uuid}", image.replace("\\","/"))
            } for idx, image in enumerate(sorted(videos, key=lambda x: datetime.strptime(x.removesuffix('.mp4'), '%Y-%m-%d-%H-%M-%S')))
        ]

        return jsonify({'status': 'success', 'images': image_urls, 'video':video_urls})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

@app.route('/api/get_photo/uploads/<path:file_path>', methods=['GET'])
def serve_photo(file_path):
    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), file_path.replace("\\","/"))
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="image/png")
    else:
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

# Print image using rundll32
def print_image_with_rundll32(image_path, frame_type):
    try:
        printer_name = 'DS-RX1 (Photostrips)' if frame_type == 'stripx2' else 'DS-RX1'
        logging.info(f"Printing to {printer_name}")
        
        # Print the image using rundll32
        print_command = f"powershell.exe Start-Process 'rundll32.exe' -ArgumentList 'C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo', '\"/pt\"', '{image_path}', '{printer_name}'"
        print(print_command)
        logging.debug(f"Executing print command: {print_command}")
        
        for i in range(print_amount):
            subprocess.run(print_command, check=True, shell=True)
        logging.info(f"Print command sent for file: {image_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error printing file: {e}")
        raise

@app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
def switch_printer(printer_model, frame_type):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    safe_filename = werkzeug.utils.secure_filename(file.filename)
    temp_dir = os.path.join(f"{os.getcwd()}/print_files")
    file_path = os.path.join(temp_dir, safe_filename)
    file_path = file_path.replace('/','\\')
    print(file_path)
    file_path = f"\\\wsl$\\Ubuntu{file_path}"
    file.save(file_path)

    try:
        print_image_with_rundll32(file_path, frame_type)
    except Exception as e:
        logging.error(f"Error processing print job: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)  # Cleanup after use
    
    return jsonify({'status': 'success', 'message': 'Print job started successfully.'})

@app.route("/api/print", methods=['POST'])
def print_photo():
    try:
        print("print_photo")
        folder_path = os.path.join(f"{os.getcwd()}/print_files")
        folder_path = os.path.abspath(folder_path)
        print(folder_path)
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)
        frame = request.form['frame']
        
        if request.files['photo'] and (request.files['photo'].mimetype.startswith('image/')):
            image_content = request.files['photo'].read()
        else:
            image_content = base64.b64decode(request.files['photo'])

        if not request.files['photo'] or not frame:
            return jsonify({'error': 'Invalid input'}), 400
        
        print_url = ''
        print_file_name = ''
        if frame == 'Stripx2':
            print_file_name = 'stripx2.png'
            print_url = os.getenv("API_PRINTER_CUT")
        elif frame == '2cut-x2':
            print_file_name = 'cutx2.png'
            print_url = os.getenv("API_PRINTER_2")
        elif frame == '3-cutx2':
            print_file_name = 'cutx3.png'
            print_url = os.getenv("API_PRINTER_3")
        elif frame == '4-cutx2':
            print_file_name = 'cutx4.png'
            print_url = os.getenv("API_PRINTER_4")
        elif frame == '5-cutx2':
            print_file_name = 'cutx5.png'
            print_url = os.getenv("API_PRINTER_5")
        elif frame == '6-cutx2':
            print_file_name = 'cutx6.png'
            print_url = os.getenv("API_PRINTER_6")
        
        file_path = os.path.join(folder_path, print_file_name)

        print(111)
        print("file_path")
        print(file_path)
        print(111)

        with open(file_path, 'wb') as destination:
            destination.write(image_content)

        # 파일이 제대로 저장되었는지 확인
        if not os.path.exists(file_path):
            return jsonify({'status':'error', 'message': 'Failed to save the file'}), 500
        
        # 파일 크기 확인
        file_size = os.path.getsize(file_path)
        if file_size == 0:
            return jsonify({'status':'error', 'message': 'Saved file is empty'}), 500
        
        # Call POST method to printer                
        with open(file_path, 'rb') as f:
            response = requests.post(print_url, files={'file': f})

        print(response.status_code)
        #print(response.text)
        if response.status_code == 200:
            return jsonify({'status':'success', 'message': 'Print job started successfully.'}), 200
        else:
            return jsonify({'status':'error', 'message': 'Failed to send print request'}), 500
    except Exception as e:
        print(e)
        return jsonify({'status':'error', 'message': 'Failed to send print request'}), 500

# Start cash payment route
@app.route('/api/get_print_amount', methods=['GET'])
def get_print_amount():
    global print_amount, check_coupon
    print_amount = request.args.get('printAmount', type=int)
    check_coupon = request.args.get('checkCoupon', type=int)

    if print_amount is not None:
        return jsonify({'printAmountReceived': print_amount})
    else:
        return jsonify({'error': 'No print amount provided'}), 400

@app.route('/api/cash/start', methods=['POST'])
def start_cash_payment():
    global inserted_money, amount_to_pay #stop_thread counter, money
    data = request.get_json()
    amount_to_pay = int(data.get('amount', 0))
    
    ser.write(b'RESET\n')
    response = ser.readline().decode('utf-8').strip()
    
    with lock:
        inserted_money = 0  # Reset the inserted money

    return jsonify({"message": "Cash payment started"}), 200

# Check payment status
@app.route('/api/cash/status', methods=['GET'])
def check_payment_status():
    global inserted_money, amount_to_pay
    baseV = 10000
    if (os.getenv('REGION')) == 'MN':
        baseV = 1000
    with lock:  # Ensure thread-safe access to the serial port
        try:
            ser.write(b'CHECK\n')
            line = ser.readline().decode('utf-8').strip().split(':').pop()
            print(line)
            if line.strip().isdigit():
                inserted_money = int(line)*baseV
                logging.info(f"Current inserted money: {inserted_money}, Current amount to pay: {amount_to_pay}")
                if inserted_money < amount_to_pay:
                    return jsonify({"status": "in progress", "total_money": inserted_money}), 200
                else:
                    return jsonify({"status": "complete", "total_money": inserted_money}), 200

        except serial.SerialException as e:
            logging.error(f"Serial communication error: {e}")
            return jsonify({"error": "Communication error with Arduino"}), 500
        except ValueError:
            return jsonify({"status": "in progress", "total_money": inserted_money}), 200

    return jsonify({"status": "in progress", "total_money": inserted_money}), 200

# Reset bill acceptor
@app.route('/api/cash/reset', methods=['POST'])
def reset_bill_acceptor():
    ser.write(b'RESET\n')
    response = ser.readline().decode('utf-8').strip()
    logging.info("Bill acceptor reset")
    return jsonify({"message": response}), 200

# Stop cash payment
@app.route('/api/cash/stop', methods=['POST'])
def stop_cash_payment():
    ser.write(b'STOP\n')
    response = ser.readline().decode('utf-8').strip()
    logging.info("Cash payment stopped")
    return jsonify({"message": response}), 200

# Create a cash payment
@app.route('/api/cash/create', methods=['GET'])
def create_cash_payment():
    device = request.args.get('device')
    amount = request.args.get('amount')
    order_code = f"{device}_{amount}"
    return jsonify({"order_code": order_code}), 200

if __name__ == '__main__':
    try:
        # Initialize serial communication with Arduino
        arduino_port = find_arduino_port()
        if arduino_port:
            ser = serial.Serial(arduino_port, 9600, timeout=1)
            logging.info(f"Arduino connected on {arduino_port}")
        else:
            logging.error("Arduino not found. Please check the connection.")
            sys.exit("Arduino not found") 

        app.run(host='0.0.0.0', port=5000)
    except Exception as e:
        print(str(e))
    finally:
        camera_manager.stop_video_recording()
        camera_manager.stop_live_view()
