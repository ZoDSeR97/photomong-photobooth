from flask import Flask, jsonify, Response, request, send_file
from PIL import Image
from flask_cors import CORS, cross_origin
from datetime import datetime
from dotenv import load_dotenv
from pathlib import PureWindowsPath, PurePosixPath
import os
import subprocess
import tempfile
import werkzeug
import logging
import requests
import time
import threading
import queue
import io
import shutil
import atexit
import cv2
import numpy as np
import uuid
import serial
import serial.tools.list_ports
import sys
import base64

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Optimization changes applied
live_view_process = None
frame_queue = queue.Queue(maxsize=0)  # Unlimited size
captured_frames = []
timer = None
live_view_thread = None
MAX_CAPTURED_FRAMES = 100
capture_count = 0

logging.basicConfig(level=logging.WARNING, format='%(asctime)s - %(levelname)s - %(message)s')

temp_dir = tempfile.mkdtemp()
frame_buffer = []
MAX_BUFFER_SIZE = 300
video_file = None
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 10.0
frame_size = (640, 480)  # Adjustable
video_filename = None

lock = threading.Lock()  # For thread safety on shared resources
inserted_money = 0
amount_to_pay = 0

# Find Arduino port
def find_arduino_port():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        if 'Arduino' in p.description:
            return p.device
    return None

# Initialize serial communication with Arduino
arduino_port = find_arduino_port()
if arduino_port:
    ser = serial.Serial(arduino_port, 9600, timeout=1)
    logging.info(f"Arduino connected on {arduino_port}")
else:
    logging.error("Arduino not found. Please check the connection.")
    sys.exit("Arduino not found")

def start_video_capture():
    global video_file, video_filename
    video_filename = os.path.join(temp_dir, f"video_{datetime.now().strftime('%Y%m%d_%H%M%S')}.mp4")
    video_file = cv2.VideoWriter(video_filename, fourcc, fps, frame_size)
    return video_filename

def stop_video_capture():
    global video_file
    if video_file:
        video_file.release()
        video_file = None

def buffer_frame(frame):
    global video_file
    if video_file is None:
        return

    nparr = np.frombuffer(frame, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    img = cv2.resize(img, frame_size)
    video_file.write(img)

def enqueue_frames(out, frame_queue, captured_frames):
    buffer = bytearray()
    while True:
        chunk = out.read(4096)
        if not chunk:
            break
        buffer.extend(chunk)
        a = buffer.find(b'\xff\xd8')
        b = buffer.find(b'\xff\xd9')
        if a != -1 and b != -1:
            frame = buffer[a:b+2]
            buffer = buffer[b+2:]
            if frame_queue.full():
                frame_queue.get()
            frame_queue.put(frame)
            if len(captured_frames) > MAX_CAPTURED_FRAMES:
                captured_frames.pop(0)  # Remove oldest frame
            captured_frames.append(frame)
            buffer_frame(frame)

def generate():
    while True:
        frame = frame_queue.get()
        if frame is None:
            break
        yield (b'--frame\r\n'
               b'Content-Type: image/png\r\n\r\n' + frame + b'\r\n\r\n')

def start_live_view():
    global live_view_process, timer, captured_frames, live_view_thread
    if live_view_thread and live_view_thread.is_alive():
        return
    captured_frames = []
    if live_view_process is None:
        live_view_process = subprocess.Popen(
            ['gphoto2', '--capture-movie', '--stdout'],
            stdout=subprocess.PIPE,
            bufsize=10**8
        )
        live_view_thread = threading.Thread(target=enqueue_frames, args=(live_view_process.stdout, frame_queue, captured_frames), daemon=True)
        live_view_thread.start()

    if timer:
        timer.cancel()
    timer = threading.Timer(9.0, stop_live_view)
    timer.start()

def stop_live_view():
    global live_view_process, timer, captured_frames, frame_buffer
    if live_view_process:
        live_view_process.terminate()
        live_view_process.wait()
        live_view_process = None
    with frame_queue.mutex:
        frame_queue.queue.clear()
    if timer:
        timer.cancel()
        timer = None

    frame_buffer.clear()
    captured_frames.clear()

@app.route('/api/video_feed', methods=['GET'])
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/start_live_view', methods=['GET'])
def start_live_view_route():
    start_live_view()
    return jsonify(status="Live view started")

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view_route():
    stop_live_view()
    return jsonify(status="Live view stopped")

def reset_usb_device(device_name):
    try:
        result = subprocess.run(['sudo', 'usbreset', device_name], capture_output=True, text=True, timeout=10)
        if result.returncode != 0:
            logging.error(f"USB reset failed: {result.stderr}")
        else:
            logging.info("USB successfully reset.")
    except subprocess.TimeoutExpired:
        logging.error(f"USB reset timed out.")
    except Exception as e:
        logging.error(f"Error during USB reset: {str(e)}")

def stop_related_processes():
    try:
        subprocess.run(['pkill', 'gvfs-gphoto2-volume-monitor'], capture_output=True)
        subprocess.run(['killall', 'gphoto2'], capture_output=True)
        subprocess.run(['sudo', 'rmmod', 'sdc2xx', 'stv680', 'spca50x'], capture_output=True)
    except Exception as e:
        logging.error(f"Failed to stop processes or unload modules: {str(e)}")

def get_usb_device_path(vendor_id, product_id):
    try:
        result = subprocess.run(['lsusb'], capture_output=True, text=True)
        for line in result.stdout.split('\n'):
            if f'{vendor_id}:{product_id}' in line:
                parts = line.split()
                bus = parts[1]
                device = parts[3][:-1]
                device_path = f'/dev/bus/usb/{bus}/{device.zfill(3)}'
                return device_path
    except Exception as e:
        logging.error(f"Error fetching USB device path: {str(e)}")
    return None

def kill_process_using_device(vendor_id, product_id):
    device_path = get_usb_device_path(vendor_id, product_id)
    if device_path:
        try:
            result = subprocess.run(['fuser', '-k', device_path], capture_output=True, text=True)
            if result.returncode == 0:
                logging.info(f"Process using {device_path} terminated.")
            else:
                logging.info(f"No process using {device_path}.")
        except Exception as e:
            logging.error(f"Failed to terminate process using {device_path}: {str(e)}")
    else:
        logging.error(f"Could not find device path: {vendor_id}:{product_id}")

def capture_image_with_retries(uuid, retries=5, delay=10):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = os.path.join(current_directory, f'{uuid}/{date_str}.png')
    debug_logfile = os.path.join(current_directory, 'gphoto2_debug.log')

    vendor_id = '04a9'  # Canon vendor ID
    product_id = '330d'  # Example product ID, replace with your camera's product ID

    for attempt in range(retries):
        stop_related_processes()
        kill_process_using_device(vendor_id, product_id)
        reset_usb_device('Canon Digital Camera')
        time.sleep(1)

        logging.info(f"Image capture attempt #{attempt+1}")
        result = subprocess.run(
            ['env', 'LANG=C', 'gphoto2', '--debug', '--debug-logfile=' + debug_logfile, '--wait-event=500ms', '--capture-image-and-download', '--filename', os.path.join(uuid, filename), '--set-config', 'capturetarget=0'],
            capture_output=True, text=True, timeout=60
        )

        if result.returncode == 0 and os.path.exists(os.path.join(uuid, filename)):
            logging.info(f"Image captured successfully: {filename}")
            start_live_view()  # Start live view after capture
            return {'status': 'success', 'file_saved_as': filename}
        else:
            logging.error(f"Failed to capture image: {result.stderr}")

        time.sleep(delay)

    return {'status': 'error', 'message': result.stderr}

@app.route('/api/capture', methods=['POST'])
@cross_origin()
def capture_image():
    global capture_count, video_filename

    data = request.get_json()
    uuid = data.get('uuid')

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID is missing.'}), 400

    result = capture_image_with_retries(uuid)
    if result['status'] == 'success':
        capture_count += 1
        image_filename = result['file_saved_as']
        #async_upload_file(image_filename, uuid, 'image/png')

        if capture_count == 1:
            video_filename = start_video_capture()

        if capture_count == 8:
            stop_video_capture()
            if video_filename and os.path.exists(video_filename):
                #async_upload_file(video_filename, uuid, 'video/mp4')
                response = jsonify({'status': 'success', 'message': 'All images captured and video uploaded'})
            else:
                response = jsonify({'status': 'success', 'message': 'All images captured, but no video to upload'})
            capture_count = 0
            return response
        else:
            return jsonify({'status': 'success', 'message': f'Image captured and uploaded ({capture_count}/8)'})
    else:
        return jsonify(result)

def async_upload_file(filename, uuid, content_type):
    threading.Thread(target=upload_file, args=(filename, uuid, content_type), daemon=True).start()

def upload_file(filename, uuid, content_type):
    try:
        with open(filename, 'rb') as f:
            files = {'file': (filename, f, content_type)}
            response = requests.post(f"{os.getenv("VITE_REACT_APP_BACKEND")}/upload/{uuid}", files=files)
            logging.info(f"File upload response: {response.status_code}")
    except Exception as e:
        logging.error(f"Failed to upload file: {str(e)}")

# Start cash payment route
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
    global stop_thread
    ser.write(b'STOP\n')
    stop_thread = True
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

# Get MAC address
@app.route('/api/get-mac-address', methods=['GET'])
def get_mac_address():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    mac_address = ':'.join(mac[i:i+2] for i in range(0, 12, 2))
    return mac_address

# Print image using rundll32
def print_image_with_rundll32(image_path, frame_type):
    try:
        printer_name = 'DS-RX1 (Photostrips)' if frame_type == 'stripx2' else 'DS-RX1'
        logging.info(f"Printing to {printer_name}")
        
        # Print the image using rundll32
        print_command = f"powershell.exe Start-Process 'rundll32.exe' -ArgumentList 'C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo', '\"/pt\"', '{image_path}', '{printer_name}'"
        logging.debug(f"Executing print command: {print_command}")

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
        images = [file for file in file_list if file.lower().endswith(('.png', '.jpg', '.jpeg','.mp4'))]
        image_urls = [
            {
                'id': idx, 
                'url': f"{request.scheme}://{request.host}/api/get_photo/uploads"+os.path.join(f"/{uuid}", image.replace("\\","/"))
            } for idx, image in enumerate(images)
        ]

        return jsonify({'status': 'success', 'images': image_urls})
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

@app.route('/api/get_print_amount', methods=['GET'])
def get_print_amount():
    print_amount = request.args.get('printAmount', type=int)
    check_coupon = request.args.get('checkCoupon', type=int)

    if print_amount is not None:
        return jsonify({'printAmountReceived': print_amount})
    else:
        return jsonify({'error': 'No print amount provided'}), 400

def cleanup_temp_dir():
    shutil.rmtree(temp_dir)

atexit.register(cleanup_temp_dir)

# Run the Flask app
if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)