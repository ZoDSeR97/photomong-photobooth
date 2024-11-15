from flask import Flask, jsonify, Response, request, send_file
from flask_cors import CORS, cross_origin
from PIL import Image
from datetime import datetime
from dotenv import load_dotenv
from pathlib import Path
import os
import subprocess
import tempfile
import werkzeug
import logging
import requests
import time
import threading
import queue
import shutil
import atexit
import ctypes
import serial
import serial.tools.list_ports
import sys
import base64
import numpy as np
import uuid
import simpleaudio as sa

# Initialize Flask app
app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Global variables for camera and live view state
camera_ref = None
evf_image_ref = None
live_view_active = False
frame_queue = queue.Queue(maxsize=100)  # Buffer for live view frames
capture_count = 0
inserted_money = 0
amount_to_pay = 0
print_amount = 1
check_coupon = 0

# Mappings
EDS_ERR_CODES = {
    # General errors
    0: "Operation completed successfully",
    1: "Operation not implemented",
    2: "Internal SDK error",
    3: "Memory allocation failed",
    4: "Memory deallocation failed",
    5: "Operation cancelled",
    6: "Incompatible SDK version",
    7: "Operation not supported",
    8: "Unexpected exception occurred",
    9: "Protection violation",
    10: "Missing subcomponent",
    11: "Selection unavailable",

    # File errors
    32: "File I/O error",
    33: "Too many open files",
    34: "File not found",
    35: "File open error",
    36: "File close error",
    37: "File seek error",
    38: "File tell error",
    39: "File read error",
    40: "File write error",
    41: "File permission error",
    42: "File disk full",
    43: "File already exists",
    44: "File format unrecognized",
    45: "File data corrupt",
    46: "File naming error",

    # Device errors
    128: "Device not found",
    129: "Device busy",
    130: "Device invalid",
    131: "Device emergency",
    132: "Device memory full",
    133: "Device internal error",
    134: "Device invalid parameter",
    135: "Device no disk",
    136: "Device disk error",
    137: "Device CF gate changed",
    138: "Device dial changed",
    139: "Device not installed",
    140: "Device stay awake",
    141: "Device not released",

    # Take picture errors
    36097: "AF failed during photo capture",
    36098: "Take picture reserved",
    36099: "Mirror up operation failed",
    36100: "Sensor cleaning in progress",
    36101: "Silent mode operation failed",
    36102: "No memory card inserted",
    36103: "Memory card error",
    36104: "Memory card write protected",
    36105: "Movie crop operation failed",
    36106: "Flash charging required",
    36107: "No lens attached",
    36108: "Special movie mode error",
    36109: "Live view prohibited mode",

    # Communication errors
    192: "Port in use",
    193: "Device disconnected",
    194: "Device incompatible",
    195: "Communication buffer full",
    196: "USB bus error",

    # PTP errors
    8195: "Session not open",
    8196: "Invalid transaction ID",
    8199: "Incomplete transfer",
    8200: "Invalid storage ID",
    8202: "Device property not supported",
    8217: "PTP device busy",
    8222: "Session already open",
    8223: "Transaction cancelled",
}

frame_map = {
    'Stripx2': ('stripx2.png', os.getenv("API_PRINTER_CUT")),
    '2cut-x2': ('cutx2.png', os.getenv("API_PRINTER_2")),
    '3-cutx2': ('cutx3.png', os.getenv("API_PRINTER_3")),
    '4-cutx2': ('cutx4.png', os.getenv("API_PRINTER_4")),
    '5-cutx2': ('cutx5.png', os.getenv("API_PRINTER_5")),
    '6-cutx2': ('cutx6.png', os.getenv("API_PRINTER_6"))
}

# Load Canon EDSDK
try:
    edsdk = ctypes.CDLL("./EDSDK_64/DLL/EDSDK.dll")
    logging.info("EDSDK loaded successfully")
except Exception as e:
    logging.error(f"Failed to load EDSDK: {e}")
    sys.exit("Failed to load EDSDK")

def play_sound_thread(file_path):
    try:
        wave_obj = sa.WaveObject.from_wave_file(file_path)
        play_obj = wave_obj.play()
        play_obj.wait_done()  # Wait until the sound has finished playing
    except Exception as e:
        print(f"Failed to play sound: {str(e)}")

# Initialize serial communication
def initialize_serial():
    """Initialize serial communication with Arduino"""
    try:
        ports = list(serial.tools.list_ports.comports())
        arduino_port = next(
            (p.device for p in ports if 'Arduino' in p.description), None)

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


def log_sdk_error(code):
    """Logs SDK errors using the error code mapping."""
    error_message = EDS_ERR_CODES.get(code, "Unknown error")
    logging.error(f"Canon SDK Error {code}: {error_message}")

# Camera Event Handler
@ctypes.CFUNCTYPE(ctypes.c_int, ctypes.c_int, ctypes.c_void_p, ctypes.c_void_p)
def camera_event_callback(event, param, context):
    if event == 0x00000200:  # Property changed event
        logging.info("Camera property changed")
    return 0

def initialize_sdk():
    """Initialize the Canon SDK"""
    result = edsdk.EdsInitializeSDK()
    if result != 0:
        log_sdk_error(result)
        return False
    logging.info("Canon SDK initialized successfully")
    return True

def terminate_sdk():
    """Terminate the Canon SDK"""
    edsdk.EdsTerminateSDK()
    logging.info("Canon SDK terminated")

def open_camera_session():
    """Open a session with the camera and register events"""
    global camera_ref

    camera_list = ctypes.c_void_p()
    camera_ref = ctypes.c_void_p()

    result = edsdk.EdsGetCameraList(ctypes.byref(camera_list))
    if result != 0:
        log_sdk_error(result)
        return None

    count = ctypes.c_int()
    result = edsdk.EdsGetChildCount(camera_list, ctypes.byref(count))
    if result != 0 and count.value == 0:
        log_sdk_error(result)
        edsdk.EdsRelease(camera_list)
        return None

    result = edsdk.EdsGetChildAtIndex(camera_list, 0, ctypes.byref(camera_ref))
    # Release camera list after obtaining camera ref
    edsdk.EdsRelease(camera_list)
    if result != 0:
        log_sdk_error(result)
        return None

    result = edsdk.EdsOpenSession(camera_ref)
    if result != 0:
        log_sdk_error(result)
        edsdk.EdsRelease(camera_ref)
        camera_ref = None
        return None

    logging.info("Camera session opened successfully")
    return camera_ref


def close_camera_session():
    """Close the camera session"""
    global camera_ref
    if camera_ref:
        edsdk.EdsCloseSession(camera_ref)
        edsdk.EdsRelease(camera_ref)
        camera_ref = None
        logging.info("Camera session closed")


def start_live_view():
    """Start the live view stream"""
    global camera_ref, live_view_active, evf_image_ref

    if not camera_ref:
        camera_ref = open_camera_session()
        if not camera_ref:
            return False

    try:
        live_view_setting = ctypes.c_uint32(1)
        result = edsdk.EdsSetPropertyData(
            camera_ref, 0x00000050, 0, 4, ctypes.byref(live_view_setting))
        if result != 0:
            log_sdk_error(result)
            return False

        evf_image_ref = ctypes.c_void_p()
        result = edsdk.EdsCreateEvfImageRef(
            camera_ref, ctypes.byref(evf_image_ref))
        if result != 0:
            log_sdk_error(result)
            return False

        live_view_active = True
        threading.Thread(target=live_view_thread, daemon=True).start()
        logging.info("Live view started successfully")
        return True

    except Exception as e:
        logging.error(f"Error starting live view: {e}")
        return False


def live_view_thread():
    """Thread for continuously capturing live view frames"""
    global live_view_active, camera_ref, evf_image_ref

    while live_view_active and camera_ref and evf_image_ref:
        try:
            result = edsdk.EdsDownloadEvfImage(camera_ref, evf_image_ref)
            if result == 0:
                stream = ctypes.c_void_p()
                edsdk.EdsCreateMemoryStream(0, ctypes.byref(stream))

                length = ctypes.c_ulonglong()
                edsdk.EdsGetLength(stream, ctypes.byref(length))

                image_data = (ctypes.c_ubyte * length.value)()
                edsdk.EdsGetPointer(stream, ctypes.byref(image_data))

                if not frame_queue.full():
                    frame_queue.put(bytes(image_data))

                edsdk.EdsRelease(stream)
            time.sleep(1 / 30)

        except Exception as e:
            logging.error(f"Error in live view thread: {e}")
            break

    live_view_active = False

def stop_live_view():
    """Stop the live view stream"""
    global live_view_active, camera_ref, evf_image_ref

    live_view_active = False
    live_view_setting = ctypes.c_uint32(0)
    edsdk.EdsSetPropertyData(camera_ref, 0x00000050, 0, 4, ctypes.byref(live_view_setting))

    if evf_image_ref:
        edsdk.EdsRelease(evf_image_ref)
        evf_image_ref = None

    with frame_queue.mutex:
        frame_queue.queue.clear()
    logging.info("Live view stopped")

def capture_image(uuid_str):
    """Capture an image and save it to disk"""
    global camera_ref
    if not camera_ref:
        camera_ref = open_camera_session()
        if not camera_ref:
            return False, "Failed to open camera session"

    try:
        save_dir = os.path.join(os.getcwd(), uuid_str)
        os.makedirs(save_dir, exist_ok=True)

        filename = f"{datetime.now().strftime('%Y-%m-%d-%H-%M-%S')}.jpg"
        filepath = os.path.join(save_dir, filename)

        stream = ctypes.c_void_p()
        result = edsdk.EdsCreateFileStream(filepath.encode(), 1, 2, ctypes.byref(stream))
        if result != 0:
            log_sdk_error(result)
            return False, "Failed to create file stream"

        result = edsdk.EdsSendCommand(camera_ref, 0, 0)
        if result != 0:
            log_sdk_error(result)
            edsdk.EdsRelease(stream)
            return False, "Failed to capture image"

        edsdk.EdsDownload(stream, ctypes.c_uint64(0), stream)
        edsdk.EdsDownloadComplete(stream)
        edsdk.EdsRelease(stream)

        logging.info(f"Image captured and saved to {filepath}")
        return True, filepath

    except Exception as e:
        logging.error(f"Error capturing image: {e}")
        return False, str(e)

# Flask Routes
@app.route('/api/get_print_amount', methods=['GET'])
def get_print_amount():
    global print_amount, check_coupon
    print_amount = request.args.get('printAmount', type=int)
    check_coupon = request.args.get('checkCoupon', type=int)

    if print_amount is not None:
        return jsonify({'printAmountReceived': print_amount})
    else:
        return jsonify({'error': 'No print amount provided'}), 400

@app.route('/api/video_feed')
def video_feed():
    def generate():
        while live_view_active:
            try:
                frame = frame_queue.get_nowait()
                yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
            except queue.Empty:
                continue

    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/start_live_view', methods=['GET'])
def start_live_view_route():
    if start_live_view():
        return jsonify({"status": "success", "message": "Live view started"})
    return jsonify({"status": "error", "message": "Failed to start live view"}), 500

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view_route():
    stop_live_view()
    return jsonify({"status": "success", "message": "Live view stopped"})

@app.route('/api/capture', methods=['POST'])
@cross_origin()
def capture_route():
    data = request.get_json()
    uuid_str = data.get('uuid')

    if not uuid_str:
        return jsonify({'status': 'error', 'message': 'UUID is required'}), 400

    success, result = capture_image(uuid_str)

    if success:
        return jsonify({'status': 'success', 'message': 'Image captured', 'file_path': result})
    else:
        return jsonify({'status': 'error', 'message': f'Failed to capture image: {result}'}), 500

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

@app.route('/api/play_sound/', methods=['POST'])
def play_sound():
    data = request.get_json()
    if not data or 'file_name' not in data:
        return jsonify({"error": "File name is required"}), 400

    file_name = data['file_name']
    print(file_name)

    # Path to the directory containing the sound files
    sound_files_directory = "playsound/"

    # Construct the full file path
    file_path = os.path.join(sound_files_directory, file_name)
    print(file_path)
    print(datetime.now())

    # Check if the file exists
    if not os.path.isfile(file_path):
        return jsonify({"error": "File not found"}), 404

    # Play the sound file using simpleaudio in a separate thread
    threading.Thread(target=play_sound_thread, args=(file_path,), daemon=True).start()

    return jsonify({"status": "Playing sound", "file_name": file_name}), 200

# Cleanup function
def cleanup():
    """Cleanup function to be called on exit"""
    stop_live_view()
    close_camera_session()
    terminate_sdk()

# Register cleanup
atexit.register(cleanup)

if __name__ == '__main__':
    try:
        # Initialize SDK
        if not initialize_sdk():
            sys.exit("Failed to initialize SDK")

        # Initialize serial communication
        ser = initialize_serial()
        if not ser:
            sys.exit("Failed to initialize serial communication")

        # Create lock for thread safety
        lock = threading.Lock()

        # Start Flask app
        app.run(host="0.0.0.0", port=5000)

    except Exception as e:
        logging.error(f"Application error: {e}")
        sys.exit(1)
    finally:
        cleanup()