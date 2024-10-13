from django.apps import AppConfig
import serial
import serial.tools.list_ports
import logging

class PaymentConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'payment'
    
    def ready(self):
        self.initialize_arduino()

    def initialize_arduino(self):
        # Arduino Initialization Logic
        logging.info("Initializing Arduino...")

        def find_arduino_port():
            ports = list(serial.tools.list_ports.comports())
            for p in ports:
                if 'Arduino' in p.description:
                    return p.device
            return None

        arduino_port = find_arduino_port()
        if arduino_port:
            global ser  # Make the serial connection accessible globally
            ser = serial.Serial(arduino_port, 9600, timeout=1)
            logging.info(f"Arduino connected on {arduino_port}")
        else:
            logging.error("Arduino not found. Please check the connection.")
            raise Exception("Arduino not found")
