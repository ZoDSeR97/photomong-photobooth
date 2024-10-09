# # # import os
# # # import subprocess
# # # import tempfile
# # # import werkzeug
# # # import logging
# # # from flask import Flask, request, jsonify
# # # from PIL import Image
# # # from pydub import AudioSegment
# # # from pydub.playback import play
# # # from flask_cors import CORS
# # # from datetime import datetime


# # # app = Flask(__name__)

# # # CORS(app)
# # # logging.basicConfig(level=logging.DEBUG)

# # # def print_image_with_rundll32(image_path,frame_type):
# # #     try:
# # #         # Determine the printer name based on the condition
# # #         print("frame_type")
# # #         print(frame_type)
# # #         print(frame_type)
# # #         if frame_type == 'stripx2':
# # #             printer_name = 'DS-RX1 (Photostrips)'
# # #         else :
# # #             printer_name = 'DS-RX1'
# # #         print(printer_name)
# # #         # Print the image using rundll32
# # #         print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
# # #         logging.debug(f"Executing print command: {print_command}")
# # #         subprocess.run(print_command, check=True, shell=True)
# # #         logging.debug(f"Print command sent for file: {image_path}")
# # #     except subprocess.CalledProcessError as e:
# # #         logging.error(f"Error printing file: {e}")
# # #         raise
# # #     except ValueError as e:
# # #         logging.error(e)
# # #         raise


# # # @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# # # def switch_printer(printer_model, frame_type):
# # #     print(request.files)
# # #     print(request)
    
# # #     if 'file' not in request.files:
# # #         return jsonify({'error': 'No file part'}), 400
    
# # #     file = request.files['file']
# # #     if file.filename == '':
# # #         return jsonify({'error': 'No selected file'}), 400
    
# # #     safe_filename = werkzeug.utils.secure_filename(file.filename)
# # #     temp_dir = tempfile.gettempdir()
# # #     file_path = os.path.join(temp_dir, safe_filename)
# # #     file.save(file_path)


# # #     print(file_path)
# # #     try:
# # #         # Print the image file
# # #         print_image_with_rundll32(file_path,frame_type)
# # #     except Exception as e:
# # #         logging.error(f"Error processing print job: {e}")
# # #         return jsonify({'error': str(e)}), 500
# # #     finally:
# # #         os.remove(file_path)
    
# # #     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})




# # # @app.route('/api/play_sound/', methods=['POST'])
# # # def play_sound():
# # #     try:
# # #         # Get JSON data from request
# # #         data = request.get_json()
# # #         if not data or 'file_name' not in data:
# # #             return jsonify({"error": "File name is required"}), 400

# # #         file_name = data['file_name']

# # #         print(file_name)

# # #         # Path to the directory containing the sound files
# # #         sound_files_directory = "playsound/"

# # #         # Construct the full file path
# # #         file_path = os.path.join(sound_files_directory, file_name)

# # #         print(file_path)

# # #         print(datetime.now())

# # #         # Check if the file exists
# # #         if not os.path.isfile(file_path):
# # #             return jsonify({"error": "File not found"}), 404

# # #         # Play the sound file using pydub
# # #         sound = AudioSegment.from_file(file_path)
# # #         play(sound)

# # #         return jsonify({"status": "Playing sound", "file_name": file_name}), 200
# # #     except Exception as e:
# # #         app.logger.error(f"Error occurred: {e}")
# # #         return jsonify({"error": str(e)}), 500

# # # if __name__ == '__main__':
# # #     app.run(host='0.0.0.0', port=8001)



# # import os
# # import subprocess
# # import tempfile
# # import werkzeug
# # import logging
# # from flask import Flask, request, jsonify
# # from PIL import Image
# # from pydub import AudioSegment, utils
# # from pydub.playback import play
# # from flask_cors import CORS
# # from datetime import datetime
# # import requests
# # import uuid
# # import serial
# # import threading



# # # Set the temporary directory for pydub
# # app = Flask(__name__)

# # CORS(app)
# # logging.basicConfig(level=logging.DEBUG)


# # # Serial communication setup
# # ser = serial.Serial('COM4', 9600, timeout=1)
# # inserted_money = 0
# # amount_to_pay = 0
# # lock = threading.Lock()

# # def read_bill_acceptor():
# #     global inserted_money
# #     print("Starting to read from bill acceptor...")
# #     while True:
# #         try:
# #             if ser.in_waiting > 0:
# #                 line = ser.readline().decode('utf-8').strip()
# #                 # print(line)
# #                 if len(line) == 5 or len(line) == 6 : 
# #                     if line.isdigit():
# #                         try:
# #                             money = int(line)
# #                             # print(f"money : {money}")
# #                             with lock:
# #                                 inserted_money += money
# #                                 # print(f"Total inserted money: {inserted_money}")
# #                         except ValueError:
# #                             print(f"Invalid data: {line}")
# #                     with lock:
# #                         if inserted_money >= int(amount_to_pay):
# #                             print("Amount to be paid is reached or exceeded.")
# #                             break
# #         except serial.SerialException as e:
# #             print(f"Serial error: {e}")
# #             break
# #         except Exception as e:
# #             print(f"Unexpected error: {e}")
# #             break

# # @app.route('/api/start', methods=['POST'])
# # def start_cash_payment():
# #     global inserted_money, amount_to_pay
# #     data = request.get_json()
# #     amount_to_pay = data.get('amount', 0)
# #     ser.write(b'RESET\n')
# #     with lock:
# #         inserted_money = 0  # Reset the inserted money
# #     threading.Thread(target=read_bill_acceptor, daemon=True).start()
# #     return jsonify({"message": "Cash payment started"}), 200

# # @app.route('/api/status', methods=['GET'])
# # def check_payment_status():
# #     ser.write(b'CHECK\n')
# #     response = ser.readline().decode('utf-8').strip()
# #     try :
# #         print(int(response))
# #     except :
# #         response = 0
# #     print(response)
# #     return jsonify({"total_money": response}), 200

# # @app.route('/api/reset', methods=['POST'])
# # def reset_bill_acceptor():
# #     ser.write(b'RESET\n')
# #     response = ser.readline().decode('utf-8').strip()
# #     return jsonify({"message": response}), 200

# # @app.route('/api/stop', methods=['POST'])
# # def stop_cash_payment():
# #     ser.write(b'STOP\n')
# #     response = ser.readline().decode('utf-8').strip()
# #     return jsonify({"message": response}), 200

# # @app.route('/payments/api/cash/create', methods=['GET'])
# # def create_cash_payment():
# #     device = request.args.get('device')
# #     amount = request.args.get('amount')
# #     order_code = f"{device}_{amount}"
# #     return jsonify({"order_code": order_code}), 200



# # # def read_bill_acceptor():
# # #     global inserted_money
# # #     print("Starting to read from bill acceptor...")
# # #     while True:
# # #         try:
# # #             # if ser.in_waiting:
# # #             line = ser.readline().decode('utf-8').strip()  # Read a line instead of a single character
# # #             # print(f"Received line: {line}")  # 데이터 확인을 위해 출력
# # #             print(line)
# # #             if line.isdigit():
# # #                 try:
# # #                     money = int(line)
# # #                     print(f"money : {money}")
# # #                     with lock:
# # #                         inserted_money += money
# # #                         print(f"Total inserted money: {inserted_money}")
# # #                 except ValueError:
# # #                     print(f"Invalid data: {line}")
# # #             with lock:
# # #                 if inserted_money >= int(amount_to_pay):
# # #                     print("Amount to be paid is reached or exceeded.")
# # #                     break
# # #         except serial.SerialException as e:
# # #             print(f"Serial error: {e}")
# # #             break
# # #         except Exception as e:
# # #             print(f"Unexpected error: {e}")
# # #             break

# # # @app.route('/api/start', methods=['POST'])
# # # def start_cash_payment():
# # #     global inserted_money, amount_to_pay
# # #     data = request.get_json()
# # #     amount_to_pay = data.get('amount', 0)
# # #     with lock:
# # #         inserted_money = 0  # Reset the inserted money
# # #     threading.Thread(target=read_bill_acceptor, daemon=True).start()
# # #     return jsonify({"message": "Cash payment started"}), 200

# # # @app.route('/api/status', methods=['GET'])
# # # def check_payment_status():
# # #     with lock:
# # #         total_money = inserted_money
# # #     return jsonify({"total_money": total_money}), 200

# # # @app.route('/api/stop', methods=['POST'])
# # # def stop_cash_payment():
# # #     global ser
# # #     try:
# # #         if ser.is_open:
# # #             ser.close()
# # #     except Exception as e:
# # #         print(f"Error closing serial port: {e}")
# # #     return jsonify({"message": "Cash payment stopped"}), 200

# # # @app.route('/payments/api/cash/create', methods=['GET'])
# # # def create_cash_payment():
# # #     device = request.args.get('device')
# # #     amount = request.args.get('amount')
# # #     order_code = f"{device}_{amount}"  # Order code 생성 논리는 필요에 따라 수정
# # #     return jsonify({"order_code": order_code}), 200

# # @app.route('/get-mac-address', methods=['GET'])
# # def get_mac_address():
# #     mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
# #     mac_address = ':'.join(mac[i:i+2] for i in range(0, 12, 2))
# #     return mac_address


# # def print_image_with_rundll32(image_path, frame_type):
# #     try:
# #         print("frame_type")
# #         print(frame_type)
# #         if frame_type == 'Stripx2':
# #             # printer_name = 'DS-RX1 (Photostrips)'
# #             printer_name = 'DSRX1CUT'
# #         else:
# #             printer_name = 'DS-RX1'
# #         print(printer_name)
# #         # Print the image using rundll32
# #         print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
# #         logging.debug(f"Executing print command: {print_command}")
# #         subprocess.run(print_command, check=True, shell=True)
# #         logging.debug(f"Print command sent for file: {image_path}")
# #     except subprocess.CalledProcessError as e:
# #         logging.error(f"Error printing file: {e}")
# #         raise
# #     except ValueError as e:
# #         logging.error(e)
# #         raise

# # @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# # def switch_printer(printer_model, frame_type):
# #     if 'file' not in request.files:
# #         return jsonify({'error': 'No file part'}), 400

# #     file = request.files['file']
# #     if file.filename == '':
# #         return jsonify({'error': 'No selected file'}), 400

# #     safe_filename = werkzeug.utils.secure_filename(file.filename)
# #     temp_dir = tempfile.gettempdir()
# #     file_path = os.path.join(temp_dir, safe_filename)
# #     file.save(file_path)

# #     try:
# #         print_image_with_rundll32(file_path, frame_type)
# #     except Exception as e:
# #         logging.error(f"Error processing print job: {e}")
# #         return jsonify({'error': str(e)}), 500
# #     finally:
# #         os.remove(file_path)

# #     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})



# # # @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# # # def switch_printer(printer_model, frame_type):
# # #     print(request.files)
# # #     print(request)
    
# # #     if 'file' not in request.files:
# # #         return jsonify({'error': 'No file part'}), 400

# # #     file = request.files['file']
# # #     if file.filename == '':
# # #         return jsonify({'error': 'No selected file'}), 400

# # #     safe_filename = werkzeug.utils.secure_filename(file.filename)
# # #     temp_dir = tempfile.gettempdir()
# # #     file_path = os.path.join(temp_dir, safe_filename)
# # #     file.save(file_path)

# # #     try:
# # #         # 이미지 파일 인쇄
# # #         print_image_with_rundll32(file_path, frame_type)
# # #     except Exception as e:
# # #         logging.error(f"Error processing print job: {e}")
# # #         return jsonify({'error': str(e)}), 500
# # #     finally:
# # #         os.remove(file_path)
    
# # #     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})


# # # def print_image_with_rundll32(image_path,frame_type):
# # #     try:
# # #         # Determine the printer name based on the condition
# # #         print("frame_type")
# # #         print(frame_type)
# # #         print(frame_type)
# # #         if frame_type == 'Stripx2':
# # #             printer_name = 'DS-RX1 (Photostrips)'
# # #         else :
# # #             printer_name = 'DS-RX1'
# # #         print(printer_name)
# # #         # Print the image using rundll32
# # #         print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
# # #         logging.debug(f"Executing print command: {print_command}")
# # #         subprocess.run(print_command, check=True, shell=True)
# # #         logging.debug(f"Print command sent for file: {image_path}")
# # #     except subprocess.CalledProcessError as e:
# # #         logging.error(f"Error printing file: {e}")
# # #         raise
# # #     except ValueError as e:
# # #         logging.error(e)
# # #         raise



# # # @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# # # def switch_printer(printer_model, frame_type):
# # #     print(request.files)
# # #     print(request)
    
# # #     if 'file' not in request.files:
# # #         return jsonify({'error': 'No file part'}), 400

# # #     file = request.files['file']
# # #     if file.filename == '':
# # #         return jsonify({'error': 'No selected file'}), 400

# # #     safe_filename = werkzeug.utils.secure_filename(file.filename)
# # #     temp_dir = tempfile.gettempdir()
# # #     file_path = os.path.join(temp_dir, safe_filename)
# # #     file.save(file_path)

# # #     try:
# # #         # 이미지 파일 인쇄
# # #         print_image_with_rundll32(file_path, frame_type)
# # #     except Exception as e:
# # #         logging.error(f"Error processing print job: {e}")
# # #         return jsonify({'error': str(e)}), 500
# # #     finally:
# # #         os.remove(file_path)
    
# # #     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})


# # # @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# # # def switch_printer(printer_model, frame_type):
# # #     print(request.files)
# # #     print(request)
    
# # #     if 'file' not in request.files:
# # #         return jsonify({'error': 'No file part'}), 400
    
# # #     file = request.files['file']
# # #     if file.filename == '':
# # #         return jsonify({'error': 'No selected file'}), 400
    
# # #     safe_filename = werkzeug.utils.secure_filename(file.filename)
# # #     temp_dir = tempfile.gettempdir()
# # #     file_path = os.path.join(temp_dir, safe_filename)
# # #     file.save(file_path)


# # #     print(file_path)
# # #     try:
# # #         # Print the image file
# # #         print_image_with_rundll32(file_path,frame_type)
# # #     except Exception as e:
# # #         logging.error(f"Error processing print job: {e}")
# # #         return jsonify({'error': str(e)}), 500
# # #     finally:
# # #         os.remove(file_path)
    
# # #     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})




# # @app.route('/api/play_sound/', methods=['POST'])
# # def play_sound():
# #     # try:
# #     # Get JSON data from request
# #     data = request.get_json()
# #     if not data or 'file_name' not in data:
# #         return jsonify({"error": "File name is required"}), 400

# #     file_name = data['file_name']

# #     print(file_name)

# #     # Path to the directory containing the sound files
# #     sound_files_directory = "playsound/"

# #     # Construct the full file path
# #     file_path = os.path.join(sound_files_directory, file_name)

# #     print(file_path)

# #     print(datetime.now())

# #     # Check if the file exists
# #     if not os.path.isfile(file_path):
# #         return jsonify({"error": "File not found"}), 404

# #     # Play the sound file using pydub
# #     sound = AudioSegment.from_file(file_path)
# #     play(sound)

# #     return jsonify({"status": "Playing sound", "file_name": file_name}), 200
# #     # except Exception as e:
# #     #     app.logger.error(f"Error occurred: {e}")
# #     #     return jsonify({"error": str(e)}), 500

# # if __name__ == '__main__':
# #     app.run(host='0.0.0.0', port=8001)
# import os
# import subprocess
# import tempfile
# import werkzeug
# import logging
# from flask import Flask, request, jsonify
# from PIL import Image
# from pydub import AudioSegment, utils
# from pydub.playback import play
# from flask_cors import CORS
# from datetime import datetime
# import requests
# import uuid
# import serial
# import serial.tools.list_ports
# import threading
# import sys

# app = Flask(__name__)

# CORS(app)
# logging.basicConfig(level=logging.DEBUG)

# def find_arduino_port():
#     ports = list(serial.tools.list_ports.comports())
#     for p in ports:
#         # 여기서 'Arduino'는 예시입니다. 실제 아두이노의 식별자에 맞게 수정하세요.
#         if 'Arduino' in p.description:
#             return p.device
#     return None

# # Serial communication setup
# arduino_port = find_arduino_port()
# if arduino_port:
#     ser = serial.Serial(arduino_port, 9600, timeout=1)
#     print(f"Arduino connected on {arduino_port}")
# else:
#     print("Arduino not found. Please check the connection.")
#     # 여기서 프로그램을 종료하거나 다른 처리를 할 수 있습니다.
#     # sys.exit("Arduino not found")

# inserted_money = 0
# amount_to_pay = 0
# lock = threading.Lock()

# def read_bill_acceptor():
#     global inserted_money
#     print("Starting to read from bill acceptor...")
#     while True:
#         try:
#             if ser.in_waiting > 0:
#                 line = ser.readline().decode('utf-8').strip()
#                 # print(line)
#                 if len(line) == 5 or len(line) == 6 : 
#                     if line.isdigit():
#                         try:
#                             money = int(line)
#                             # print(f"money : {money}")
#                             with lock:
#                                 inserted_money += money
#                                 # print(f"Total inserted money: {inserted_money}")
#                         except ValueError:
#                             print(f"Invalid data: {line}")
#                     with lock:
#                         if inserted_money >= int(amount_to_pay):
#                             print("Amount to be paid is reached or exceeded.")
#                             break
#         except serial.SerialException as e:
#             print(f"Serial error: {e}")
#             break
#         except Exception as e:
#             print(f"Unexpected error: {e}")
#             break

# @app.route('/api/start', methods=['POST'])
# def start_cash_payment():
#     global inserted_money, amount_to_pay
#     data = request.get_json()
#     amount_to_pay = data.get('amount', 0)
#     ser.write(b'RESET\n')
#     with lock:
#         inserted_money = 0  # Reset the inserted money
#     threading.Thread(target=read_bill_acceptor, daemon=True).start()
#     return jsonify({"message": "Cash payment started"}), 200

# @app.route('/api/status', methods=['GET'])
# def check_payment_status():
#     ser.write(b'CHECK\n')
#     response = ser.readline().decode('utf-8').strip()
#     try :
#         print(int(response))
#     except :
#         response = 0
#     print(response)
#     return jsonify({"total_money": response}), 200

# @app.route('/api/reset', methods=['POST'])
# def reset_bill_acceptor():
#     ser.write(b'RESET\n')
#     response = ser.readline().decode('utf-8').strip()
#     return jsonify({"message": response}), 200

# @app.route('/api/stop', methods=['POST'])
# def stop_cash_payment():
#     ser.write(b'STOP\n')
#     response = ser.readline().decode('utf-8').strip()
#     return jsonify({"message": response}), 200

# @app.route('/payments/api/cash/create', methods=['GET'])
# def create_cash_payment():
#     device = request.args.get('device')
#     amount = request.args.get('amount')
#     order_code = f"{device}_{amount}"
#     return jsonify({"order_code": order_code}), 200

# @app.route('/get-mac-address', methods=['GET'])
# def get_mac_address():
#     mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
#     mac_address = ':'.join(mac[i:i+2] for i in range(0, 12, 2))
#     return mac_address

# def print_image_with_rundll32(image_path, frame_type):
#     try:
#         print("frame_type")
#         print(frame_type)
#         if frame_type == 'Stripx2':
#             # printer_name = 'DS-RX1 (Photostrips)'
#             printer_name = 'DSRX1CUT'
#         else:
#             printer_name = 'DS-RX1'
#         print(printer_name)
#         # Print the image using rundll32
#         print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
#         logging.debug(f"Executing print command: {print_command}")
#         subprocess.run(print_command, check=True, shell=True)
#         logging.debug(f"Print command sent for file: {image_path}")
#     except subprocess.CalledProcessError as e:
#         logging.error(f"Error printing file: {e}")
#         raise
#     except ValueError as e:
#         logging.error(e)
#         raise

# @app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
# def switch_printer(printer_model, frame_type):
#     if 'file' not in request.files:
#         return jsonify({'error': 'No file part'}), 400

#     file = request.files['file']
#     if file.filename == '':
#         return jsonify({'error': 'No selected file'}), 400

#     safe_filename = werkzeug.utils.secure_filename(file.filename)
#     temp_dir = tempfile.gettempdir()
#     file_path = os.path.join(temp_dir, safe_filename)
#     file.save(file_path)

#     try:
#         print_image_with_rundll32(file_path, frame_type)
#     except Exception as e:
#         logging.error(f"Error processing print job: {e}")
#         return jsonify({'error': str(e)}), 500
#     finally:
#         os.remove(file_path)

#     return jsonify({'status': 'success', 'message': 'Print job started successfully.'})

# @app.route('/api/play_sound/', methods=['POST'])
# def play_sound():
#     data = request.get_json()
#     if not data or 'file_name' not in data:
#         return jsonify({"error": "File name is required"}), 400

#     file_name = data['file_name']

#     print(file_name)

#     # Path to the directory containing the sound files
#     sound_files_directory = "playsound/"

#     # Construct the full file path
#     file_path = os.path.join(sound_files_directory, file_name)

#     print(file_path)

#     print(datetime.now())

#     # Check if the file exists
#     if not os.path.isfile(file_path):
#         return jsonify({"error": "File not found"}), 404

#     # Play the sound file using pydub
#     sound = AudioSegment.from_file(file_path)
#     play(sound)

#     return jsonify({"status": "Playing sound", "file_name": file_name}), 200

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=8001)



import os
import subprocess
import tempfile
import werkzeug
import logging
from flask import Flask, request, jsonify
from PIL import Image
from flask_cors import CORS
from datetime import datetime
import requests
import uuid
import serial
import serial.tools.list_ports
import threading
import sys
import winsound

app = Flask(__name__)

CORS(app)
logging.basicConfig(level=logging.DEBUG)

def find_arduino_port():
    ports = list(serial.tools.list_ports.comports())
    for p in ports:
        # 여기서 'Arduino'는 예시입니다. 실제 아두이노의 식별자에 맞게 수정하세요.
        if 'Arduino' in p.description:
            return p.device
    return None

# Serial communication setup
arduino_port = find_arduino_port()
if arduino_port:
    ser = serial.Serial(arduino_port, 9600, timeout=1)
    print(f"Arduino connected on {arduino_port}")
else:
    print("Arduino not found. Please check the connection.")
    # 여기서 프로그램을 종료하거나 다른 처리를 할 수 있습니다.
    # sys.exit("Arduino not found")

inserted_money = 0
amount_to_pay = 0
lock = threading.Lock()

def read_bill_acceptor():
    global inserted_money
    print("Starting to read from bill acceptor...")
    while True:
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                # print(line)
                if len(line) == 5 or len(line) == 6 : 
                    if line.isdigit():
                        try:
                            money = int(line)
                            # print(f"money : {money}")
                            with lock:
                                inserted_money += money
                                # print(f"Total inserted money: {inserted_money}")
                        except ValueError:
                            print(f"Invalid data: {line}")
                    with lock:
                        if inserted_money >= int(amount_to_pay):
                            print("Amount to be paid is reached or exceeded.")
                            break
        except serial.SerialException as e:
            print(f"Serial error: {e}")
            break
        except Exception as e:
            print(f"Unexpected error: {e}")
            break

@app.route('/api/start', methods=['POST'])
def start_cash_payment():
    global inserted_money, amount_to_pay
    data = request.get_json()
    amount_to_pay = data.get('amount', 0)
    ser.write(b'RESET\n')
    with lock:
        inserted_money = 0  # Reset the inserted money
    threading.Thread(target=read_bill_acceptor, daemon=True).start()
    return jsonify({"message": "Cash payment started"}), 200

@app.route('/api/status', methods=['GET'])
def check_payment_status():
    ser.write(b'CHECK\n')
    response = ser.readline().decode('utf-8').strip()
    try :
        print(int(response))
    except :
        response = 0
    print(response)
    return jsonify({"total_money": response}), 200

@app.route('/api/reset', methods=['POST'])
def reset_bill_acceptor():
    ser.write(b'RESET\n')
    response = ser.readline().decode('utf-8').strip()
    return jsonify({"message": response}), 200

@app.route('/api/stop', methods=['POST'])
def stop_cash_payment():
    ser.write(b'STOP\n')
    response = ser.readline().decode('utf-8').strip()
    return jsonify({"message": response}), 200

@app.route('/payments/api/cash/create', methods=['GET'])
def create_cash_payment():
    device = request.args.get('device')
    amount = request.args.get('amount')
    order_code = f"{device}_{amount}"
    return jsonify({"order_code": order_code}), 200

@app.route('/get-mac-address', methods=['GET'])
def get_mac_address():
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    mac_address = ':'.join(mac[i:i+2] for i in range(0, 12, 2))
    return mac_address

def print_image_with_rundll32(image_path, frame_type):
    try:
        print("frame_type")
        print(frame_type)
        if frame_type == 'stripx2':
            printer_name = 'DS-RX1 (Photostrips)'
            # printer_name = 'DSRX1CUT'
        else:
            printer_name = 'DS-RX1'
        print(printer_name)
        # Print the image using rundll32
        print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
        logging.debug(f"Executing print command: {print_command}")
        subprocess.run(print_command, check=True, shell=True)
        logging.debug(f"Print command sent for file: {image_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error printing file: {e}")
        raise
    except ValueError as e:
        logging.error(e)
        raise

@app.route('/api/switch-printer/<printer_model>/<frame_type>/', methods=['POST'])
def switch_printer(printer_model, frame_type):
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    safe_filename = werkzeug.utils.secure_filename(file.filename)
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, safe_filename)
    file.save(file_path)

    try:
        print_image_with_rundll32(file_path, frame_type)
    except Exception as e:
        logging.error(f"Error processing print job: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        os.remove(file_path)

    return jsonify({'status': 'success', 'message': 'Print job started successfully.'})

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

    # Play the sound file using winsound in a separate thread
    threading.Thread(target=play_sound_thread, args=(file_path,), daemon=True).start()

    return jsonify({"status": "Playing sound", "file_name": file_name}), 200

def play_sound_thread(file_path):
    try:
        winsound.PlaySound(file_path, winsound.SND_FILENAME)
    except Exception as e:
        print(f"Failed to play sound: {str(e)}")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8001)

