#!/usr/bin/env python3
from contextlib import contextmanager
import logging
from flask import Flask, send_file, jsonify, request
from flask_cors import CORS, cross_origin
from dotenv import load_dotenv
import gphoto2 as gp
import time
import atexit
import threading
from datetime import datetime
import os

app = Flask(__name__)
load_dotenv()  # take environment variables from .env.
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Global variables to manage camera state
camera = None
context = None
recording_thread = None
is_recording = False
current_sequence = 0
TOTAL_SEQUENCES = 8

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
        self.init_logging()

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
            logging.error(
                "Maximum error count reached. Camera needs manual intervention.")
            return False
        return True

    def initialize_camera(self):
        """Initialize camera connection with error handling"""
        try:
            if self.camera is not None:
                self.camera.exit()
                self.camera = None

            if self.context is not None:
                self.context.exit()
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
                self.context.exit()
                self.context = None

            time.sleep(2)
            return self.initialize_camera()

        except gp.GPhoto2Error as e:
            logging.error(f"Failed to recover camera: {str(e)}")
            return False

    def capture_image(self, uuid, retries=3):
        """Capture image with improved error handling and recovery"""
        if self.error_count >= self.MAX_ERRORS and \
           time.time() - self.last_error_time < self.ERROR_TIMEOUT:
            return {'status': 'error', 'message': 'Camera in recovery timeout'}

        self.reset_error_state()

        with self.camera_lock():
            for attempt in range(retries):
                try:
                    if not self.check_camera_ready():
                        if not self.recover_camera():
                            continue

                    # Prepare the file path
                    current_directory = os.path.dirname(
                        os.path.abspath(__file__))
                    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
                    filename = os.path.join(current_directory, f'{uuid}/{date_str}.png')

                    # Ensure directory exists
                    os.makedirs(os.path.dirname(filename), exist_ok=True)

                    # Capture the image
                    logging.info("Capturing image...")
                    camera_path = self.camera.capture(
                        gp.GP_CAPTURE_IMAGE, self.context)

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

            return {'status': 'error', 'message': 'Failed to capture image after multiple attempts'}

    def start_live_view(self):
        """Start live view with error handling"""
        try:
            if not self.check_camera_ready():
                if not self.recover_camera():
                    return False

            config = self.camera.get_config(self.context)
            # Enable live view if the camera supports it
            output = config.get_child_by_name('output')
            if output:
                output.set_value('PC')
                self.camera.set_config(config, self.context)
            return True

        except gp.GPhoto2Error as e:
            logging.error(f"Failed to start live view: {str(e)}")
            self.handle_error(e)
            return False

    def stop_live_view(self):
        """Stop live view with error handling"""
        try:
            if self.camera:
                config = self.camera.get_config(self.context)
                output = config.get_child_by_name('output')
                if output:
                    output.set_value('Off')
                    self.camera.set_config(config, self.context)
        except gp.GPhoto2Error as e:
            logging.error(f"Failed to stop live view: {str(e)}")

    def cleanup(self):
        """Clean up camera resources"""
        try:
            if self.camera:
                self.camera.exit()
                self.camera = None
            if self.context:
                self.context.exit()
                self.context = None
        except gp.GPhoto2Error as e:
            logging.error(f"Error during cleanup: {str(e)}")

# Initialize camera manager
camera_manager = CameraManager()

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

# Register cleanup on exit
atexit.register(camera_manager.cleanup)

# Update the capture route to use the new camera manager
@app.route('/api/capture', methods=['POST'])
@cross_origin()
def capture_image():
    global capture_count, video_filename

    data = request.get_json()
    uuid = data.get('uuid')

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID is missing.'}), 400

    result = camera_manager.capture_image(uuid)
    if result['status'] == 'success':
        capture_count += 1
        image_filename = result['file_saved_as']

        if capture_count == 1:
            video_filename = start_video_capture()

        if capture_count == 8:
            stop_video_capture()
            if video_filename and os.path.exists(video_filename):
                response = jsonify(
                    {'status': 'success', 'message': 'All images captured and video uploaded'})
            else:
                response = jsonify(
                    {'status': 'success', 'message': 'All images captured, but no video to upload'})
            capture_count = 0
            return response
        else:
            return jsonify({'status': 'success', 'message': f'Image captured and uploaded ({capture_count}/8)'})
    else:
        return jsonify(result)

# Update live view routes
@app.route('/api/start_live_view', methods=['GET'])
def start_live_view_route():
    if camera_manager.start_live_view():
        return jsonify(status="Live view started")
    return jsonify(status="Failed to start live view"), 500

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view_route():
    camera_manager.stop_live_view()
    return jsonify(status="Live view stopped")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)