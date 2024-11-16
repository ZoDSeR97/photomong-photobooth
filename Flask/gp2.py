from gphoto2 import Camera
from gphoto2.common import GPError
from flask import Flask, jsonify, Response, request
import cv2
import threading
import queue
import os
import numpy as np
from datetime import datetime

app = Flask(__name__)

frame_queue = queue.Queue(maxsize=0)
captured_frames = []
live_view_thread = None
camera = Camera()
camera.init()

MAX_CAPTURED_FRAMES = 100
frame_size = (640, 480)
fps = 10.0


def start_live_view():
    """Start live view using gphoto2-python."""
    global live_view_thread

    def enqueue_frames():
        while True:
            try:
                frame = camera.capture_preview()  # Captures a preview image
                if frame_queue.full():
                    frame_queue.get()
                frame_queue.put(frame)
                if len(captured_frames) > MAX_CAPTURED_FRAMES:
                    captured_frames.pop(0)
                captured_frames.append(frame)
            except GPError:
                break  # Stop on camera disconnection or error

    if live_view_thread and live_view_thread.is_alive():
        return
    live_view_thread = threading.Thread(target=enqueue_frames, daemon=True)
    live_view_thread.start()


def stop_live_view():
    """Stop live view."""
    global live_view_thread
    if live_view_thread and live_view_thread.is_alive():
        live_view_thread.join()
    camera.exit()


def generate():
    """Stream video frames to the client."""
    while True:
        frame = frame_queue.get()
        if frame is None:
            break
        # Convert frame to JPEG
        _, jpeg = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + jpeg.tobytes() + b'\r\n\r\n')


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


@app.route('/api/capture', methods=['POST'])
def capture_image():
    data = request.get_json()
    uuid = data.get('uuid')

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID is missing.'}), 400

    current_directory = os.path.dirname(os.path.abspath(__file__))
    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = os.path.join(current_directory, f'{uuid}/{date_str}.jpg')

    try:
        image = camera.capture_image()
        with open(filename, 'wb') as f:
            f.write(image)
        return jsonify({'status': 'success', 'file_saved_as': filename})
    except GPError as e:
        return jsonify({'status': 'error', 'message': str(e)})


if __name__ == '__main__':
    try:
        app.run(host='0.0.0.0', port=5000, debug=True)
    finally:
        camera.exit()
