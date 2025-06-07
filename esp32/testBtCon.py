import asyncio
import json
from bleak import BleakClient, BleakScanner

# Replace with the BLE device name or MAC address of your ESP32
TARGET_NAME = "SmartAquarium"  # or use the MAC address like "C8:3F:26:12:34:56"
CHAR_UUID = "6e4fe646-a8f0-4892-8ef4-9ac94142da48"  # Replace with your ESP32's write characteristic UUID

# JSON data to send
data = {
    "ssid": "MyNetwork",
    "password": "MyPassword",
}
json_str = json.dumps(data)

async def send_ble_data():
    # Scan for the ESP32
    print("Scanning for BLE devices...")
    devices = await BleakScanner.discover()

    esp32 = None
    for d in devices:
        if d.name == TARGET_NAME or d.address == TARGET_NAME:
            esp32 = d
            break

    if not esp32:
        print(f"Device '{TARGET_NAME}' not found.")
        return

    print(f"Connecting to {esp32.name} ({esp32.address})...")
    async with BleakClient(esp32) as client:
        if not client.is_connected:
            print("Failed to connect.")
            return

        print("Connected. Sending data...")
        await client.write_gatt_char(CHAR_UUID, json_str.encode())
        print(f"Sent: {json_str}")

    print("BLE connection closed.")

# Run the BLE send task
asyncio.run(send_ble_data())
