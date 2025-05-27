"""
Test Bluetooth Connection with ESP32

This script sends JSON data over a Bluetooth connection to an ESP32 device.
It assumes the ESP32 is set up to receive JSON data via Bluetooth.
"""

import serial
import json
import time

com_port = "COM10"
baud_rate = 9600

# JSON data to send
data = {
    "ssid": "MyNetwork",
    "password": "MyPassword",
}

json_str = json.dumps(data) + "\n"

try:
    print(f"Connecting to {com_port}...\n")
    ser = serial.Serial(com_port, baud_rate, timeout=1)
    time.sleep(2)

    ser.write(json_str.encode())
    print(f"Sent: {json_str.strip()}\n")

finally:
    ser.close()
    print("Bluetooth connection closed.")
