""" import serial
import serial.tools.list_ports

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
    logging.error("Arduino not found. Please check the connection.") """