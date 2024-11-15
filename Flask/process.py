from flask import Flask, send_file, jsonify
from flask_cors import CORS, cross_origin
from contextlib import contextmanager
from dotenv import load_dotenv
from datetime import datetime
import time
import threading
import subprocess
import os
import logging

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

class Camera:
    def __init__(self):
        self.vendor_id = '04a9'  # Canon vendor ID
        self.product_id = '330d'  # Update this to match your camera
        self.lock = threading.Lock()
        self.is_busy = False
        self.last_error_time = None
        self.error_count = 0
        self.MAX_ERRORS = 3
        self.ERROR_TIMEOUT = 300  # 5 minutes timeout after max errors

    @contextmanager
    def camera_lock(self):
        """Context manager for thread-safe camera operations"""
        try:
            self.lock.acquire()
            self.is_busy = True
            yield
        finally:
            self.is_busy = False
            self.lock.release()

    def reset_error_state(self):
        """Reset error counter if enough time has passed"""
        if self.last_error_time and time.time() - self.last_error_time > self.ERROR_TIMEOUT:
            self.error_count = 0
            self.last_error_time = None

    def handle_error(self):
        """Handle camera errors with exponential backoff"""
        self.error_count += 1
        self.last_error_time = time.time()
        if self.error_count >= self.MAX_ERRORS:
            logging.error("Maximum error count reached. Camera needs manual intervention.")
            return False
        return True

    def kill_gphoto2_processes(self):
        """Kill all gphoto2 and related processes"""
        processes = ['gphoto2', 'gvfs-gphoto2-volume-monitor']
        for proc in processes:
            try:
                subprocess.run(['pkill', '-9', proc], capture_output=True)
                time.sleep(1)
            except Exception as e:
                logging.warning(f"Failed to kill {proc}: {str(e)}")

    def reset_usb_device(self):
        """Reset USB device with better error handling"""
        try:
            # First, try using usbreset
            subprocess.run(['sudo', 'usbreset', f'{self.vendor_id}:{self.product_id}'], capture_output=True, timeout=5)
        except Exception:
            try:
                # Fallback to unbind/bind method
                device_path = self.get_usb_device_path()
                if device_path:
                    subprocess.run(['sudo', 'sh', '-c', f'echo "{device_path}" > /sys/bus/usb/drivers/usb/unbind'])
                    time.sleep(2)
                    subprocess.run(['sudo', 'sh', '-c', f'echo "{device_path}" > /sys/bus/usb/drivers/usb/bind'])
                    time.sleep(2)
            except Exception as e:
                logging.error(f"Failed to reset USB device: {str(e)}")

    def get_usb_device_path(self):
        """Get USB device path using sysfs"""
        try:
            result = subprocess.run(['lsusb', '-d', f'{self.vendor_id}:{self.product_id}'], capture_output=True, text=True)
            if result.returncode == 0:
                bus = result.stdout.split()[1]
                device = result.stdout.split()[3][:-1]
                return f"{bus}-{device}"
        except Exception as e:
            logging.error(f"Failed to get USB device path: {str(e)}")
        return None

    def check_camera_ready(self):
        """Check if camera is ready and responding"""
        try:
            result = subprocess.run(['gphoto2', '--auto-detect'], capture_output=True, text=True, timeout=5)
            return self.vendor_id.lower() in result.stdout.lower()
        except Exception:
            return False

    def recover_camera(self):
        """Attempt to recover camera from error state"""
        logging.info("Attempting camera recovery...")
        self.kill_gphoto2_processes()
        time.sleep(2)
        self.reset_usb_device()
        time.sleep(2)
        
        # Reload USB modules if needed
        try:
            subprocess.run(['sudo', 'modprobe', '-r', 'usb-storage'])
            subprocess.run(['sudo', 'modprobe', 'usb-storage'])
            time.sleep(2)
        except Exception as e:
            logging.warning(f"Failed to reload USB modules: {str(e)}")

        return self.check_camera_ready()

    def capture_image(self, uuid, retries=3):
        """Capture image with improved error handling and recovery"""
        if self.error_count >= self.MAX_ERRORS and time.time() - self.last_error_time < self.ERROR_TIMEOUT:
            return {'status': 'error', 'message': 'Camera in recovery timeout'}

        self.reset_error_state()
        
        with self.camera_lock():
            for attempt in range(retries):
                try:
                    if not self.check_camera_ready():
                        if not self.recover_camera():
                            continue

                    current_directory = os.path.dirname(os.path.abspath(__file__))
                    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
                    filename = os.path.join(current_directory, f'{uuid}/{date_str}.png')
                    
                    # Set configuration with timeout
                    subprocess.run(['gphoto2', '--set-config', 'capturetarget=0'], timeout=5, capture_output=True)
                    
                    # Capture image with timeout
                    result = subprocess.run(
                        ['gphoto2', '--capture-image-and-download', '--filename', filename],
                        capture_output=True,
                        text=True,
                        timeout=15
                    )

                    if result.returncode == 0 and os.path.exists(filename):
                        self.error_count = 0
                        return {'status': 'success', 'file_saved_as': filename}

                except subprocess.TimeoutExpired:
                    logging.error("Camera operation timed out")
                    self.recover_camera()
                except Exception as e:
                    logging.error(f"Camera operation failed: {str(e)}")
                    self.recover_camera()

                if not self.handle_error():
                    break
                
                time.sleep(2 ** attempt)  # Exponential backoff

            return {'status': 'error', 'message': 'Failed to capture image after multiple attempts'}

# Initialize camera instance
camera = Camera()

# Update the capture route to use the new camera class
@app.route('/api/capture', methods=['POST'])
@cross_origin()
def capture_image():
    global capture_count, video_filename

    data = request.get_json()
    uuid = data.get('uuid')

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID is missing.'}), 400

    result = camera.capture_image(uuid)
    if result['status'] == 'success':
        capture_count += 1
        image_filename = result['file_saved_as']

        if capture_count == 1:
            video_filename = start_video_capture()

        if capture_count == 8:
            stop_video_capture()
            if video_filename and os.path.exists(video_filename):
                response = jsonify({'status': 'success', 'message': 'All images captured and video uploaded'})
            else:
                response = jsonify({'status': 'success', 'message': 'All images captured, but no video to upload'})
            capture_count = 0
            return response
        else:
            return jsonify({'status': 'success', 'message': f'Image captured and uploaded ({capture_count}/8)'})
    else:
        return jsonify(result)