#include <OneWire.h>
#include <DallasTemperature.h>

// GPIO Connections
#define TEMPERATURE_SENSOR 4 // DS18B20

// Setup a oneWire instance
OneWire oneWire(TEMPERATURE_SENSOR);

// Pass oneWire reference to DallasTemperature library
DallasTemperature sensors(&oneWire);

void setup() {
  Serial.begin(9600);
  sensors.begin();
}

void loop() {
  sensors.requestTemperatures(); // Send command to get temperatures
  float tempC = sensors.getTempCByIndex(0); // Get temperature of first sensor

  if (tempC != DEVICE_DISCONNECTED_C) {
    Serial.print("Temperature: ");
    Serial.print(tempC);
    Serial.println(" °C");
  } else {
    Serial.println("Error: Could not read temperature data");
  }

  delay(2000); // Wait 2 seconds between readings
}
