from unittest import result
from flask import Flask, jsonify, Response, request, send_file
from flask_cors import CORS, cross_origin
from contextlib import contextmanager
from PIL import Image
from dotenv import load_dotenv
from datetime import datetime
from pathlib import Path
import ctypes
from ctypes import *
import os
import time
import threading
import numpy as np
import cv2
import queue
import logging
import serial
import serial.tools.list_ports
import requests
import base64
import werkzeug
import subprocess
import sys

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
camera_server = None
lock = threading.Lock()  # For thread safety on shared resources
inserted_money = 0
amount_to_pay = 0
print_amount = 1
check_coupon = 0

frame_map = {
    'Stripx2': ('stripx2.png', os.getenv("API_PRINTER_CUT")),
    '2cut-x2': ('cutx2.png', os.getenv("API_PRINTER_2")),
    '3-cutx2': ('cutx3.png', os.getenv("API_PRINTER_3")),
    '4-cutx2': ('cutx4.png', os.getenv("API_PRINTER_4")),
    '5-cutx2': ('cutx5.png', os.getenv("API_PRINTER_5")),
    '6-cutx2': ('cutx6.png', os.getenv("API_PRINTER_6"))
}

# Initialize serial communication
def initialize_serial():
    """Initialize serial communication with Arduino"""
    try:
        ports = list(serial.tools.list_ports.comports())
        arduino_port = next((p.device for p in ports if 'Arduino' in p.description), None)

        if arduino_port:
            ser = serial.Serial(arduino_port, 9600, timeout=1)
            logging.info(f"Arduino connected on {arduino_port}")
            return ser
        else:
            logging.error("Arduino not found")
            return None

    except Exception as e:
        logging.error(f"Error initializing serial communication: {e}")
        return None

class EDSDKWrapper:
    def __init__(self):
        self.sdk = None
        self.camera = None
        self.session = None
        self.live_view_active = False
        self.recording = False
        self.frame_queue = queue.Queue(maxsize=180)
        self.video_writer = None
        self.initialize_camera()

    def initialize_camera(self):
        try:
            print("Initializing SDK...")
            self.sdk = windll.LoadLibrary("./EDSDK_64/Dll/EDSDK.dll")
            err = self.sdk.EdsInitializeSDK()
            if err != 0:
                raise Exception(f"Failed to initialize SDK. Error: {err}")

            print("Getting camera list...")
            camera_list = c_void_p()
            self.sdk.EdsGetCameraList(byref(camera_list))
            camera = c_void_p()
            err = self.sdk.EdsGetChildAtIndex(camera_list, 0, byref(camera))
            if err != 0:
                raise Exception(f"Failed to get camera. Error: {err}")
            self.camera = camera

            print("Opening session...")
            if self.camera is None:
                raise Exception("No camera selected")
            print(camera)
            err = self.sdk.EdsOpenSession(self.camera)
            if err != 0:
                raise Exception(f"Failed to open session. Error: {err}")
            self.session = True

        except Exception as e:
            logging.error(f"Failed to initialize camera: {e}")

    def download_evf_data(self):
        """Download live view data from camera"""
        evf_image = c_void_p()
        self.sdk.EdsCreateEvfImageRef(byref(evf_image))
        self.sdk.EdsDownloadEvfImage(self.camera, evf_image)

        stream = c_void_p()
        self.sdk.EdsGetPointer(evf_image, byref(stream))

        length = c_ulonglong()
        self.sdk.EdsGetLength(stream, byref(length))

        image_data = (c_ubyte * length.value)()
        self.sdk.EdsRead(stream, 0, length, image_data)

        nparr = np.frombuffer(image_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        return img

    def start_live_view(self):
        """Start live view mode"""
        if not self.session:
            raise Exception("No active session")

        # Set camera to live view mode
        err = self.sdk.EdsSendCommand(self.camera, 0x01, 4)  # Start live view
        if err != 0:
            raise Exception("Failed to start live view")

        self.live_view_active = True
        threading.Thread(target=self._live_view_thread, daemon=True).start()

    def _live_view_thread(self):
        """Background thread for live view processing"""
        while self.live_view_active:
            frame = self.download_evf_data()
            if frame is not None:
                if self.frame_queue.full():
                    self.frame_queue.get_nowait()  # Remove oldest frame
                self.frame_queue.put(frame)

                if self.recording and self.video_writer:
                    self.video_writer.write(frame)

            time.sleep(0.0167)  # ~60fps

    def generate_frames(self):
        """Generator function for streaming frames"""
        while True:
            print(self.frame_queue.qsize())
            if not self.frame_queue.empty():
                frame = self.frame_queue.get_nowait()
                ret, buffer = cv2.imencode('.jpg', frame)
                yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            else:
                time.sleep(0.0167)

    def start_recording(self, uuid):
        """Start video recording from live view"""
        if not self.live_view_active:
            self.start_live_view()

        # Prepare the file path
        current_directory = os.path.dirname(os.path.abspath(__file__))
        date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        filename = os.path.join(current_directory, f'{uuid}/{date_str}.mp4')

        # Ensure directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)

        frame = self.frame_queue.get()
        height, width = frame.shape[:2]
        self.video_writer = cv2.VideoWriter(
            filename,
            cv2.VideoWriter_fourcc(*'mp4v'),
            60.0,
            (width, height)
        )
        self.recording = True

    def take_photo(self, uuid):
        """Take a high-quality still photo"""
        # Stop recording and live view during photo capture
        was_recording = self.recording
        was_live_view = self.live_view_active

        if was_recording:
            self.stop_recording()

        if was_live_view:
            self.stop_live_view()

        # Take photo
        self.sdk.EdsSendCommand(self.camera, 0, 0)  # Take photo command
        time.sleep(2)  # Wait for image capture

        # Download image
        volume = c_void_p()
        self.sdk.EdsGetChildAtIndex(self.camera, 0, byref(volume))

        dir_item = c_void_p()
        self.sdk.EdsGetChildAtIndex(volume, 0, byref(dir_item))

        # Prepare the file path
        current_directory = os.path.dirname(os.path.abspath(__file__))
        date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
        filename = os.path.join(current_directory, f'{uuid}/{date_str}.jpg')

        # Ensure directory exists
        os.makedirs(os.path.dirname(filename), exist_ok=True)

        stream = c_void_p()
        self.sdk.EdsCreateFileStream(
            filename,
            1,  # Create
            2,  # Read/Write
            byref(stream)
        )

        self.sdk.EdsDownload(dir_item, stream)
        self.sdk.EdsDownloadComplete(dir_item)

        # Restart previous states
        if was_live_view:
            self.start_live_view()

        if was_recording:
            self.start_recording()

        # Verify file exists and has size
        if os.path.exists(filename) and os.path.getsize(filename) > 0:
            self.error_count = 0
            self.start_live_view()
            return {'status': 'success', 'file_saved_as': filename}
        else:
            raise Exception("Captured file is empty or missing")

    def stop_recording(self):
        """Stop video recording"""
        self.recording = False
        if self.video_writer:
            self.video_writer.release()
            self.video_writer = None

    def stop_live_view(self):
        """Stop live view mode"""
        self.live_view_active = False
        self.sdk.EdsSendCommand(self.camera, 0x01, 0)  # Stop live view

    def close_session(self):
        """Close communication session"""
        if self.session:
            self.stop_live_view()
            self.stop_recording()
            self.sdk.EdsCloseSession(self.camera)
            self.session = None

    def terminate_sdk(self):
        """Terminate SDK"""
        if self.camera:
            self.close_session()
        self.sdk.EdsTerminateSDK()

@app.route('/api/start_live_view', methods=['GET'])
def start_live_view():
    try:
        if not camera_server.live_view_active:
            camera_server.start_live_view()
        return jsonify({"status": "success", "message": "Live view started"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view():
    try:
        if not camera_server.live_view_active:
            camera_server.stop_live_view()
        return jsonify({"status": "success", "message": "Live view stopped"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

@app.route('/api/video_feed')
def video_feed():
    return Response(camera_server.generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/capture', methods=['POST'])
def take_photo():
    try:
        data = request.get_json()
        uuid = data.get('uuid', 'default_uuid')
        result = camera_server.take_photo(uuid)
        return jsonify(result)
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)})

# Route to download a file
@app.route('/api/get_photo', methods=['GET'])
def download_file():
    # Assuming the files are stored in a specific directory on WSL
    uuid = request.args.get('uuid')
    if (not uuid):
        return jsonify({'status': 'error', 'message': 'No uuid'}), 200
    file_directory = os.path.join(
        os.path.dirname(os.path.abspath(__file__)),  uuid)
    try:
        file_list = os.listdir(file_directory)
        print("###########")
        print("file_list")
        print(file_list)
        print("###########")
        images = [file for file in file_list if file.lower().endswith(
            ('.png', '.jpg'))]
        image_urls = [
            {
                'id': idx,
                'url': f"http://{request.host}/api/get_photo/uploads"+os.path.join(f"/{uuid}", image.replace("\\", "/"))
            } for idx, image in enumerate(sorted(images, key=lambda x: datetime.strptime(x.removesuffix('.png'), '%Y-%m-%d-%H-%M-%S')))
        ]
        videos = [file for file in file_list if file.lower().endswith(('.mp4'))]
        video_urls = [
            {
                'id': idx,
                'url': f"http://{request.host}/api/get_photo/uploads"+os.path.join(f"/{uuid}", image.replace("\\", "/"))
            } for idx, image in enumerate(sorted(videos, key=lambda x: datetime.strptime(x.removesuffix('.mp4'), '%Y-%m-%d-%H-%M-%S')))
        ]

        return jsonify({'status': 'success', 'images': image_urls, 'video': video_urls})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': 'File not found'}), 404
    
@app.route('/api/get_photo/uploads/<path:file_path>', methods=['GET'])
def serve_photo(file_path):
    file_path = os.path.join(os.path.dirname(
        os.path.abspath(__file__)), file_path.replace("\\", "/"))
    if os.path.exists(file_path):
        return send_file(file_path, mimetype="image/jpg")
    else:
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

# Cash payment routes (keeping the existing implementation)
@app.route('/api/cash/start', methods=['POST'])
def start_cash_payment():
    global inserted_money, amount_to_pay
    data = request.get_json()
    amount_to_pay = int(data.get('amount', 0))

    ser.write(b'RESET\n')
    response = ser.readline().decode('utf-8').strip()

    with lock:
        inserted_money = 0

    return jsonify({"message": "Cash payment started"}), 200

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

# Print image using rundll32
def print_image_with_rundll32(image_path, frame_type):
    try:
        printer_name = 'RX1-Photostrips' if frame_type == 'stripx2' else 'DS-RX1'
        logging.info(f"Printing to {printer_name}")

        # Print the image using rundll32
        print_command = f"powershell.exe Start-Process 'rundll32.exe' -ArgumentList 'C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo', '\"/pt\"', '{
            image_path}', '{printer_name}'"
        print(print_command)
        logging.debug(f"Executing print command: {print_command}")

        for _ in range(print_amount):
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
    temp_dir = Path.cwd() / "print_files"
    temp_dir.mkdir(exist_ok=True)

    file_path = temp_dir / safe_filename
    file.save(str(file_path))

    try:
        print_image_with_rundll32(str(file_path), frame_type)
    except Exception as e:
        logging.error(f"Error processing print job: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        if file_path.exists():
            os.remove(file_path)  # Cleanup after use

    return jsonify({'status': 'success', 'message': 'Print job started successfully.'})

@app.route("/api/print", methods=['POST'])
def print_photo():
    global frame_map
    try:
        folder_path = Path.cwd() / "print_files"
        folder_path.mkdir(exist_ok=True)

        frame = request.form.get('frame')
        photo = request.files.get('photo')

        if not frame or not photo:
            return jsonify({'error': 'Invalid input'}), 400

        # Read image content
        image_content = (
            photo.read() if photo.mimetype.startswith('image/')
            else base64.b64decode(request.form['photo'])
        )

        print_file_name, print_url = frame_map.get(frame, (None, None))

        if not print_file_name or not print_url:
            return jsonify({'error': 'Invalid frame type'}), 400

        file_path = folder_path / print_file_name
        file_path.write_bytes(image_content)

        if not file_path.exists() or file_path.stat().st_size == 0:
            return jsonify({'status': 'error', 'message': 'Failed to save the file or file is empty'}), 500

        with open(file_path, 'rb') as f:
            response = requests.post(print_url, files={'file': f})

        if response.status_code == 200:
            return jsonify({'status': 'success', 'message': 'Print job started successfully.'}), 200
        else:
            return jsonify({'status': 'error', 'message': 'Failed to send print request'}), 500
    except Exception as e:
        logging.error(f"Error in print_photo: {e}")
        return jsonify({'status': 'error', 'message': 'Failed to send print request'}), 500

# Route to download a file
@app.route('/api/get_photo', methods=['GET'])
def download_file():
    uuid = request.args.get('uuid')
    if not uuid:
        return jsonify({'status': 'error', 'message': 'No uuid provided'}), 400

    file_directory = Path(__file__).parent / uuid
    if not file_directory.exists():
        return jsonify({'status': 'error', 'message': 'Directory not found'}), 404

    images = [
        file for file in file_directory.iterdir()
        if file.suffix.lower() in {'.png', '.jpg', '.jpeg', '.mp4'}
    ]
    image_urls = [
        {
            'id': idx,
            'url': f"{request.scheme}://{request.host}/api/get_photo/uploads/{uuid}/{file.name}"
        }
        for idx, file in enumerate(images)
    ]

    return jsonify({'status': 'success', 'images': image_urls})

@app.route('/api/get_photo/uploads/<path:file_path>', methods=['GET'])
def serve_photo(file_path):
    full_path = Path(__file__).parent / file_path
    if full_path.exists():
        return send_file(full_path, mimetype="image/png")
    else:
        return jsonify({'status': 'error', 'message': 'File not found'}), 404

if __name__ == '__main__':
    try:
        # Initialize SDK
        camera_server = EDSDKWrapper()
        if not camera_server:
            sys.exit("Failed to initialize SDK")
        
        # Initialize serial communication
        ser = initialize_serial()
        if not ser:
            sys.exit("Failed to initialize serial communication")

        app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)
    except Exception as e:
        print(str(e))
    finally:
        camera_server.close_session()
        camera_server.terminate_sdk()