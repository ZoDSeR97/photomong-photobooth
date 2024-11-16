from flask import Flask, jsonify, Response, request
from flask_cors import CORS
import gphoto2 as gp
import cv2
import threading
import queue
import os
import logging
import numpy as np
from datetime import datetime
from contextlib import contextmanager
import time
import atexit

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

# Global variables
frame_queue = queue.Queue(maxsize=10)
live_view_thread = None
camera = None
context = None
camera_lock = threading.Lock()
is_busy = False
last_error_time = None
error_count = 0
MAX_ERRORS = 3
ERROR_TIMEOUT = 300  # 5 minutes timeout after max errors
LIVE_VIEW_ACTIVE = False
PREVIEW_INTERVAL = 0.1  # 100ms between preview captures

def init_logging():
    """Initialize gphoto2 logging callbacks"""
    def cb(level, domain, string, data=None):
        logging.debug(f'gphoto2 [{domain}] {string.strip()}')

    gp.use_python_logging()
    gp.check_result(gp.gp_log_add_func(gp.GP_LOG_DEBUG, cb))

@contextmanager
def get_camera_lock():
    """Thread-safe context manager for camera operations"""
    global is_busy
    try:
        camera_lock.acquire()
        is_busy = True
        yield
    finally:
        is_busy = False
        camera_lock.release()

def reset_error_state():
    """Reset error counter if timeout has passed"""
    global error_count, last_error_time
    if last_error_time and time.time() - last_error_time > ERROR_TIMEOUT:
        error_count = 0
        last_error_time = None

def handle_error(error):
    """Handle camera errors with exponential backoff"""
    global error_count, last_error_time
    error_count += 1
    last_error_time = time.time()
    logging.error(f"Camera error: {str(error)}")

    if error_count >= MAX_ERRORS:
        logging.error("Maximum error count reached. Camera needs manual intervention.")
        return False
    return True

def initialize_camera():
    """Initialize camera connection with error handling"""
    global camera, context
    try:
        if camera is not None:
            camera.exit()
            camera = None

        # Create new context and camera
        context = gp.Context()
        camera = gp.Camera()
        camera.init(context)

        # Configure capture target to internal RAM
        config = camera.get_config(context)
        capture_target = config.get_child_by_name('capturetarget')
        capture_target.set_value('Internal RAM')

        # Try to configure viewfinder if available
        try:
            viewfinder = config.get_child_by_name('viewfinder')
            if viewfinder:
                viewfinder.set_value(1)
        except gp.GPhoto2Error:
            pass  # Not all cameras have this setting

        camera.set_config(config, context)

        return True

    except gp.GPhoto2Error as e:
        logging.error(f"Failed to initialize camera: {str(e)}")
        handle_error(e)
        return False

def check_camera_ready():
    """Check if camera is responsive"""
    global camera, context
    try:
        if camera is None:
            return initialize_camera()

        # Try to get camera summary as a simple test
        camera.get_summary(context)
        return True
    except gp.GPhoto2Error:
        return False

def recover_camera():
    """Attempt to recover camera from error state"""
    global camera, context, LIVE_VIEW_ACTIVE
    logging.info("Attempting camera recovery...")

    try:
        LIVE_VIEW_ACTIVE = False  # Stop live view during recovery
        if camera:
            camera.exit()
            camera = None

        time.sleep(2)  # Wait before reconnecting
        return initialize_camera()

    except gp.GPhoto2Error as e:
        logging.error(f"Failed to recover camera: {str(e)}")
        return False

def start_live_view():
    """Start live view using gphoto2-python with error handling"""
    global live_view_thread, camera, context, LIVE_VIEW_ACTIVE

    def enqueue_frames():
        consecutive_errors = 0
        while LIVE_VIEW_ACTIVE:
            try:
                if not check_camera_ready():
                    if not recover_camera():
                        time.sleep(2)
                        continue

                preview_file = camera.capture_preview(context)
                preview_data = preview_file.get_data_and_size()

                # Convert preview data to OpenCV format
                nparr = np.frombuffer(preview_data, np.uint8)
                frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

                if frame is not None and frame.size > 0:
                    if frame_queue.full():
                        frame_queue.get()
                    frame_queue.put(frame)
                    consecutive_errors = 0  # Reset error counter on success

                time.sleep(PREVIEW_INTERVAL)  # Add delay between captures

            except gp.GPhoto2Error as ex:
                consecutive_errors += 1
                logging.error(f"Error in live view: {str(ex)}")

                if consecutive_errors >= 3:  # Three consecutive errors trigger recovery
                    if not handle_error(ex):
                        break
                    recover_camera()
                    consecutive_errors = 0

                time.sleep(1)  # Longer delay after error

    try:
        if LIVE_VIEW_ACTIVE:
            return True  # Already running

        if not check_camera_ready():
            if not recover_camera():
                return False

        config = camera.get_config(context)
        # Enable live view if the camera supports it
        output = config.get_child_by_name('output')
        if output:
            output.set_value('PC')
            camera.set_config(config, context)

        LIVE_VIEW_ACTIVE = True
        if live_view_thread and live_view_thread.is_alive():
            return True

        live_view_thread = threading.Thread(target=enqueue_frames, daemon=True)
        live_view_thread.start()
        return True

    except gp.GPhoto2Error as e:
        logging.error(f"Failed to start live view: {str(e)}")
        handle_error(e)
        return False

def stop_live_view():
    """Stop live view."""
    global live_view_thread, camera, context, LIVE_VIEW_ACTIVE
    LIVE_VIEW_ACTIVE = False

    try:
        if camera:
            config = camera.get_config(context)
            output = config.get_child_by_name('output')
            if output:
                output.set_value('Off')
                camera.set_config(config, context)

        if live_view_thread and live_view_thread.is_alive():
            live_view_thread.join(timeout=2.0)

    except gp.GPhoto2Error as e:
        logging.error(f"Failed to stop live view: {str(e)}")

def generate():
    """Stream video frames to the client."""
    while True:
        try:
            frame = frame_queue.get(timeout=5)  # 5 second timeout
            if frame is None:
                break
            # Convert frame to JPEG
            _, jpeg = cv2.imencode('.jpg', frame)
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')
        except queue.Empty:
            continue

def capture_image(uuid, retries=3):
    """Capture image with improved error handling and recovery"""
    global error_count, last_error_time

    if error_count >= MAX_ERRORS and time.time() - last_error_time < ERROR_TIMEOUT:
        return {'status': 'error', 'message': 'Camera in recovery timeout'}

    reset_error_state()

    with get_camera_lock():
        for attempt in range(retries):
            try:
                if not check_camera_ready():
                    if not recover_camera():
                        continue

                # Prepare the file path
                current_directory = os.path.dirname(os.path.abspath(__file__))
                date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
                filename = os.path.join(current_directory, f'{uuid}/{date_str}.jpg')

                # Ensure directory exists
                os.makedirs(os.path.dirname(filename), exist_ok=True)

                # Capture the image
                logging.info("Capturing image...")
                camera_path = camera.capture(gp.GP_CAPTURE_IMAGE, context)

                # Download the image
                logging.info("Downloading image...")
                camera_file = camera.file_get(
                    camera_path.folder,
                    camera_path.name,
                    gp.GP_FILE_TYPE_NORMAL,
                    context
                )

                camera_file.save(filename)

                # Verify file exists and has size
                if os.path.exists(filename) and os.path.getsize(filename) > 0:
                    error_count = 0
                    return {'status': 'success', 'file_saved_as': filename}
                else:
                    raise Exception("Captured file is empty or missing")

            except gp.GPhoto2Error as e:
                logging.error(f"GPhoto2 error during capture: {str(e)}")
                if not handle_error(e):
                    break
                recover_camera()
            except Exception as e:
                logging.error(f"Unexpected error during capture: {str(e)}")
                if not handle_error(e):
                    break
                recover_camera()

            time.sleep(2 ** attempt)  # Exponential backoff

        return {'status': 'error', 'message': 'Failed to capture image after multiple attempts'}

@app.route('/api/video_feed')
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/api/start_live_view', methods=['GET'])
def start_live_view_route():
    if start_live_view():
        return jsonify(status="Live view started")
    return jsonify(status="Failed to start live view"), 500

@app.route('/api/stop_live_view', methods=['GET'])
def stop_live_view_route():
    stop_live_view()
    return jsonify(status="Live view stopped")

@app.route('/api/capture', methods=['POST'])
def capture_image_route():
    data = request.get_json()
    uuid = data.get('uuid')

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID is missing.'}), 400

    result = capture_image(uuid)
    return jsonify(result)

def cleanup():
    """Clean up camera resources"""
    global camera
    try:
        if camera:
            camera.exit()
            camera = None
    except gp.GPhoto2Error as e:
        logging.error(f"Error during cleanup: {str(e)}")

# Register cleanup on exit
atexit.register(cleanup)

# Initialize logging
init_logging()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)