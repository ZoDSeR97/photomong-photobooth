""" 
This is Flask server for Linux to control EOS R50 camera, 
only work in Linux atm bc gphoto2 is a linux exclusive library
"""

from flask import Flask, jsonify, Response, request
import subprocess
from datetime import datetime
import time
import requests
from flask_cors import CORS, cross_origin
import threading
import queue
import os
import logging
import io
import tempfile
import shutil
import atexit
import cv2
import numpy as np

app = Flask(__name__)
CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

live_view_process = None
frame_queue = queue.Queue(maxsize=10)
captured_frames = []
timer = None

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

temp_dir = tempfile.mkdtemp()
capture_count = 0

# 전역 변수
frame_buffer = []
MAX_BUFFER_SIZE = 300  # 약 30초 분량 (10fps 가정)
video_file = None
fourcc = cv2.VideoWriter_fourcc(*'mp4v')
fps = 10.0
frame_size = (640, 480)  # 조정 가능
video_filename = None

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

    # JPEG 프레임을 numpy 배열로 변환
    nparr = np.frombuffer(frame, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # 필요한 경우 프레임 크기 조정
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
            captured_frames.append(frame)
            buffer_frame(frame)

def generate():
    while True:
        frame = frame_queue.get()
        if frame is None:
            break
        yield (b'--frame\r\n'
               b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n\r\n')

def start_live_view():
    global live_view_process, timer, captured_frames
    captured_frames = []
    if live_view_process is None:
        live_view_process = subprocess.Popen(
            ['gphoto2', '--capture-movie', '--stdout'],
            stdout=subprocess.PIPE,
            bufsize=10**8
        )
        threading.Thread(target=enqueue_frames, args=(live_view_process.stdout, frame_queue, captured_frames)).start()

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

@app.route('/video_feed', methods=['GET'])
def video_feed():
    return Response(generate(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/start_live_view', methods=['GET'])
def start_live_view_route():
    start_live_view()
    return jsonify(status="Live view started")

@app.route('/stop_live_view', methods=['GET'])
def stop_live_view_route():
    stop_live_view()
    return jsonify(status="Live view stopped")

def reset_usb_device(device_name):
    try:
        result = subprocess.run(['sudo', 'usbreset', device_name], capture_output=True, text=True)
        if result.returncode != 0:
            logging.error(f"USB 장치 리셋 실패: {result.stderr}")
        else:
            logging.info("USB 장치가 성공적으로 리셋되었습니다.")
    except Exception as e:
        logging.error(f"USB 장치 리셋 중 에러 발생: {str(e)}")

def stop_related_processes():
    try:
        subprocess.run(['pkill', 'gvfs-gphoto2-volume-monitor'], capture_output=True)
        subprocess.run(['killall', 'gphoto2'], capture_output=True)
        subprocess.run(['sudo', 'rmmod', 'sdc2xx', 'stv680', 'spca50x'], capture_output=True)
    except Exception as e:
        logging.error(f"프로세스를 중지하거나 모듈을 언로드하는 데 실패했습니다: {str(e)}")

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
        logging.error(f"USB 장치 경로를 가져오는 중 에러 발생: {str(e)}")
    return None

def kill_process_using_device(vendor_id, product_id):
    device_path = get_usb_device_path(vendor_id, product_id)
    if device_path:
        try:
            result = subprocess.run(['fuser', '-k', device_path], capture_output=True, text=True)
            if result.returncode == 0:
                logging.info(f"{device_path}를 사용하는 프로세스가 종료되었습니다.")
            else:
                logging.info(f"{device_path}를 사용하는 프로세스가 없습니다.")
        except Exception as e:
            logging.error(f"{device_path} 장치를 사용하는 프로세스를 종료하는 데 실패했습니다: {str(e)}")
    else:
        logging.error(f"장치 경로를 찾을 수 없습니다: {vendor_id}:{product_id}")

def capture_image_with_retries(uuid, retries=5, delay=10):
    current_directory = os.path.dirname(os.path.abspath(__file__))
    date_str = datetime.now().strftime('%Y-%m-%d-%H-%M-%S')
    filename = os.path.join(current_directory, f'{date_str}.jpeg')
    debug_logfile = os.path.join(current_directory, 'gphoto2_debug.log')

    vendor_id = '04a9'  # Canon vendor ID
    product_id = '330d'  # Example product ID, replace with your camera's product ID

    for attempt in range(retries):
        stop_related_processes()
        kill_process_using_device(vendor_id, product_id)
        reset_usb_device('Canon Digital Camera')
        time.sleep(1)  # 장치가 리셋되고 안정화될 시간을 줍니다.
        logging.info(f"이미지 캡처 시도, 시도 #{attempt+1}")

        result = subprocess.run(
            ['env', 'LANG=C', 'gphoto2', '--debug', '--debug-logfile=' + debug_logfile, '--wait-event=500ms', '--capture-image-and-download', '--filename', os.path.join(uuid,filename), '--set-config', 'capturetarget=0'],      
            capture_output=True, text=True
        )

        logging.info(f"Gphoto2 캡처 결과: {result.stdout} {result.stderr}")

        if result.returncode == 0:
            if os.path.exists(os.path.join(uuid,filename)):
                logging.info(f"이미지 캡처 성공: {os.path.join(uuid,filename)}")
                start_live_view()  # 캡처 후 start_live_view 호출
                return {'status': 'success', 'file_saved_as': filename}
            else:
                logging.error(f"이미지 캡처 실패, 파일을 찾을 수 없음: {os.path.join(uuid,filename)}")
                return {'status': 'error', 'message': '캡처 후 파일을 찾을 수 없습니다'}
        else:
            if 'PTP Device Busy' in result.stderr or 'Could not claim the USB device' in result.stderr:
                logging.warning(f"장치가 바쁘거나 USB 장치를 가져올 수 없습니다. 지연 후 재시도 중... (Attempt {attempt+1})")
            else:
                logging.error(f"이미지 캡처 실패: {result.stderr}")
        time.sleep(10)

    return {'status': 'error', 'message': result.stderr}

@app.route('/capture', methods=['POST'])
@cross_origin()
def capture_image():
    global capture_count, video_filename

    data = request.get_json()
    uuid = data.get('uuid')

    logging.info(f"Capture request received. Current capture count: {capture_count}")

    if not uuid:
        return jsonify({'status': 'error', 'message': 'UUID가 제공되지 않았습니다.'}), 400

    result = capture_image_with_retries(uuid)
    if result['status'] == 'success':
        capture_count += 1

        image_filename = result['file_saved_as']
        if upload_file(image_filename, uuid, 'image/jpeg'):
            logging.info(f"Image uploaded successfully: {image_filename}")
        else:
            logging.error(f"Failed to upload image: {image_filename}")

        if capture_count == 1:
            video_filename = start_video_capture()

        if capture_count == 8:
            logging.info(f"8th capture reached. Stopping video capture.")
            stop_video_capture()
            if video_filename and os.path.exists(video_filename):
                if upload_file(video_filename, uuid, 'video/mp4'):
                    logging.info("Video uploaded successfully.")
                    response = jsonify({'status': 'success', 'message': 'All images captured and video uploaded'})
                else:
                    logging.error("Failed to upload video.")
                    response = jsonify({'status': 'error', 'message': 'Failed to upload video'})
            else:
                logging.warning("No video to upload.")
                response = jsonify({'status': 'success', 'message': 'All images captured, but no video to upload'})

            capture_count = 0
            return response
        else:
            return jsonify({'status': 'success', 'message': f'Image captured and uploaded ({capture_count}/8)'})
    else:
        return jsonify(result)

def upload_file(filename, uuid, content_type):
    try:
        with open(filename, 'rb') as f:
            files = {'file': (filename, f, content_type)}
            response = requests.post('http://3.26.21.10:8000/upload/', files=files, data={'uuid': uuid})
            logging.info(f"파일 업로드 응답 상태 코드: {response.status_code}")
            logging.info(f"파일 업로드 응답 내용: {response.content}")
            if response.status_code == 200:
                logging.info("파일 업로드 성공")
                return True
            else:
                logging.error(f"파일 업로드 실패, 상태 코드 {response.status_code}")
                return False
    except Exception as e:
        logging.error(f"파일 업로드 중 오류 발생: {str(e)}")
        return False

@app.route('/get_print_amount', methods=['GET'])
def get_print_amount():
    print_amount = request.args.get('printAmount', type=int)
    check_coupon = request.args.get('checkCoupon', type=int)

    if print_amount is not None:
        return jsonify({'printAmountReceived': print_amount})
    else:
        return jsonify({'error': 'No print amount provided'}), 400

def cleanup_temp_dir():
    try:
        shutil.rmtree(temp_dir)
        logging.info(f"임시 디렉토리 삭제 완료: {temp_dir}")
    except Exception as e:
        logging.error(f"임시 디렉토리 삭제 중 오류 발생: {str(e)}")

atexit.register(cleanup_temp_dir)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, threaded=True, debug=True)