from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from PIL import Image, ImageWin
import os
import subprocess
import tempfile
import threading
import uuid
import json
import logging
import win32print
import win32ui
#from payments.apps import ser  # Import the globally initialized serial object

# Setup logger
logging.basicConfig(level=logging.DEBUG)

# Global variables for payment handling
inserted_money = 0
amount_to_pay = 0
lock = threading.Lock()

# Function to read the bill acceptor in a separate thread


def read_bill_acceptor():
    global inserted_money
    logging.info("Starting to read from bill acceptor...")
    while True:
        try:
            if ser.in_waiting > 0:
                line = ser.readline().decode('utf-8').strip()
                if line.isdigit():
                    money = int(line)
                    with lock:
                        inserted_money += money
                        logging.info(f"Total inserted money: {inserted_money}")
                        if inserted_money >= amount_to_pay:
                            logging.info("Payment amount reached or exceeded.")
                            break
        except serial.SerialException as e:
            logging.error(f"Serial error: {e}")
            break
        except Exception as e:
            logging.error(f"Unexpected error: {e}")
            break

# Start cash payment


@csrf_exempt
def start_cash_payment(request):
    global inserted_money, amount_to_pay
    if request.method == 'POST':
        data = json.loads(request.body.decode('utf-8'))
        amount_to_pay = data.get('amount', 0)

        ser.write(b'RESET\n')  # Reset the bill acceptor

        with lock:
            inserted_money = 0  # Reset the inserted money

        threading.Thread(target=read_bill_acceptor, daemon=True).start()
        return JsonResponse({"message": "Cash payment started"}, status=200)

# Check payment status


@csrf_exempt
def check_payment_status(request):
    ser.write(b'CHECK\n')  # Send the CHECK command to the Arduino
    response = ser.readline().decode('utf-8').strip()

    try:
        total_money = int(response)
    except ValueError:
        total_money = 0

    logging.info(f"Current inserted money: {total_money}")
    return JsonResponse({"total_money": total_money}, status=200)

# Reset bill acceptor


@csrf_exempt
def reset_bill_acceptor(request):
    ser.write(b'RESET\n')  # Send RESET command to the Arduino
    response = ser.readline().decode('utf-8').strip()
    logging.info("Bill acceptor reset")
    return JsonResponse({"message": response}, status=200)

# Stop cash payment


@csrf_exempt
def stop_cash_payment(request):
    ser.write(b'STOP\n')  # Send STOP command to the Arduino
    response = ser.readline().decode('utf-8').strip()
    logging.info("Cash payment stopped")
    return JsonResponse({"message": response}, status=200)

# Create a cash payment


@csrf_exempt
def create_cash_payment(request):
    device = request.GET.get('device')
    amount = request.GET.get('amount')
    order_code = f"{device}_{amount}"
    return JsonResponse({"order_code": order_code}, status=200)

# Get MAC address


def get_mac_address(request):
    mac = uuid.UUID(int=uuid.getnode()).hex[-12:]
    mac_address = ':'.join(mac[i:i+2] for i in range(0, 12, 2))
    return JsonResponse({"mac_address": mac_address}, status=200)

# Print image using rundll32
@csrf_exempt
def print_image_with_rundll32(image_path, frame_type):
    try:
        printer_name = 'DS-RX1 (Photostrips)' #if frame_type == 'stripx2' else 'DS-RX1'
        logging.info(f"Printing to {printer_name}")

        print_command = f'rundll32.exe C:\\Windows\\System32\\shimgvw.dll,ImageView_PrintTo /pt "{image_path}" "{printer_name}"'
        logging.debug(f"Executing print command: {print_command}")

        subprocess.run(print_command, check=True, shell=True)
        logging.info(f"Print command sent for file: {image_path}")
    except subprocess.CalledProcessError as e:
        logging.error(f"Error printing file: {e}")
        raise

# Switch printer and print image
@csrf_exempt
def switch_printer(request, printer_model, frame_type):
    if request.method == 'POST':
        if 'file' not in request.FILES:
            return JsonResponse({'error': 'No file part'}, status=400)

        file = request.FILES['file']
        if file.name == '':
            return JsonResponse({'error': 'No selected file'}, status=400)

        file_path = os.path.join(f"{os.getcwd()}\\payment\\print_files", file.name)

        with open(file_path, 'wb+') as f:
            for chunk in file.chunks():
                f.write(chunk)

        try:
            print_image_with_rundll32(file_path, frame_type)
        except Exception as e:
            #logging.error(f"Error processing print job: {e}")
            return JsonResponse({'error in rundll': str(e)}, status=500)
        """ finally:
            if os.path.exists(file_path):
                os.remove(file_path) """

        return JsonResponse({'status': 'success', 'message': 'Print job started successfully.'}, status=200)

# Play sound


@csrf_exempt
def play_sound(request):
    data = json.loads(request.body.decode('utf-8'))
    if 'file_name' not in data:
        return JsonResponse({"error": "File name is required"}, status=400)

    file_name = data['file_name']
    sound_files_directory = "playsound/"
    file_path = os.path.join(sound_files_directory, file_name)

    if not os.path.isfile(file_path):
        return JsonResponse({"error": "File not found"}, status=404)

    threading.Thread(target=play_sound_thread, args=(
        file_path,), daemon=True).start()

    return JsonResponse({"status": "Playing sound", "file_name": file_name}, status=200)

# Function to play sound in a separate thread


def play_sound_thread(file_path):
    try:
        winsound.PlaySound(file_path, winsound.SND_FILENAME)
    except Exception as e:
        logging.error(f"Failed to play sound: {str(e)}")