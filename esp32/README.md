# ESP32 Docs

## Board Settings

- Board: ESP32 Freenove FNK0046

![alt text](images/image.png)

- Baud Rate: 9600

## Secrets

All sensitive information is stored in a separate file called `secrets.h`. You can create this file by copying the template provided below.

```cpp
#ifndef SECRETS_H

#define SECRETS_H

const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";
const char* serverUrl = "YOUR_SERVER_URL";

#endif
```

## Sensor/Actuators checklist

- [x] Temperature Sensor
- [x] TDS Sensor
- [ ] pH Sensor
- [ ] Light Sensor
- [ ] Depth Sensor (Ultrasonic)
- [ ] OLED Display

## Libraries Used

- DallasTemperature
- OneWire
- WiFi
- HTTPClient
- ArduinoJson

## Bibliography

- <https://albertherd.com/2019/01/02/connecting-a-ds18b20-thermal-sensor-to-your-raspberry-pi-raspberry-pi-temperature-monitoring-part-1/>
- <https://www.youtube.com/watch?v=Vy650KLXIyY&ab_channel=ThalesFerreira>
- <https://wiki.keyestudio.com/KS0429_keyestudio_TDS_Meter_V1.0#TDS_Meter>
- <https://randomnerdtutorials.com/esp32-tds-water-quality-sensor>
