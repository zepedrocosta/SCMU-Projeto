#ifndef CREDENTIALS_CALLBACK_H

#define CREDENTIALS_CALLBACK_H

#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>
#include <ArduinoJson.h>
#include <Preferences.h>

extern bool credentialsReceivedBT;
extern Preferences preferences;

class CredentialsCallback : public BLECharacteristicCallbacks
{
    void onWrite(BLECharacteristic *characteristic) override
    {
        String value = characteristic->getValue();
        if (value.length() > 0)
        {
            Serial.println("Received BLE data:");
            Serial.println(value);

            StaticJsonDocument<256> doc;
            DeserializationError error = deserializeJson(doc, value);
            if (!error)
            {
                String ssid = String(doc["ssid"] | "");
                String password = String(doc["password"] | "");

                Serial.print("Parsed SSID: ");
                Serial.println(ssid);

                preferences.begin("wifi", false); // namespace = "wifi"
                preferences.putString("ssid", ssid);
                preferences.putString("pass", password);
                preferences.end();
                credentialsReceivedBT = true;
            }
            else
            {
                Serial.println("Failed to parse JSON");
            }
        }
    }
};

#endif
