/**
 * Smart Aquarium
 * SCMU - 24/25 - NOVA FCT
 * @author: José Costa - 62637
 * @author: Rodrigo Albuquerque - 70294
 * @author: Rafael Mira - 59243
 */

#include <OneWire.h>
#include <DallasTemperature.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <secrets.h>

// GPIO Connections
#define TEMPERATURE_SENSOR 4 // DS18B20
#define TDS_SENSOR 34        // TDS Sensor
#define LDR_SENSOR 35        // LDR Sensor

#define VREF 3.3  // Reference voltage for the ADC
#define SCOUNT 30 // sum of sample point

OneWire oneWire(TEMPERATURE_SENSOR);
DallasTemperature sensors(&oneWire);

int analogBuffer[SCOUNT];

void setup()
{
  Serial.begin(9600);
  delay(2000);
  Serial.println("Initializing SCMU project!");
  sensors.begin();            // Inicia o sensor de temperatura
  pinMode(TDS_SENSOR, INPUT); // TDS
  pinMode(LDR_SENSOR, INPUT);

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected to WiFi\n");
}

void loop()
{
  float tempC = readTemperature();
  float tdsValue = readTDS(tempC);
  int hasLight = readLDR(); // 0 -> há luz / 1 -> não há luz

  delay(2000); // espera 2 segundos entre leituras
}

float readTemperature()
{
  sensors.requestTemperatures();
  float tempC = sensors.getTempCByIndex(0);

  if (tempC == DEVICE_DISCONNECTED_C)
  {
    Serial.println("Error: Could not read temperature");
    return DEVICE_DISCONNECTED_C;
  }

  Serial.print("Temperature: ");
  Serial.print(tempC);
  Serial.println(" °C");

  return tempC;
}

float readTDS(float temperature)
{
  for (int i = 0; i < SCOUNT; i++)
  {
    analogBuffer[i] = analogRead(TDS_SENSOR);
    delay(2); // pequeno delay para estabilidade entre amostras (2 milissegundos)
  }

  int medianValue = getMedianNum(analogBuffer, SCOUNT);
  float averageVoltage = medianValue * (float)VREF / 4096.0;

  float compensationCoefficient = 1.0 + 0.02 * (temperature - 25.0);
  float compensationVoltage = averageVoltage / compensationCoefficient;

  float tds = (133.42 * pow(compensationVoltage, 3) - 255.86 * pow(compensationVoltage, 2) + 857.39 * compensationVoltage) * 0.5;

  Serial.print("TDS Value: ");
  Serial.print(tds, 0);
  Serial.println(" ppm");

  return tds;
}

int readLDR()
{
  int lightState = digitalRead(LDR_SENSOR);

  if (lightState == HIGH)
    Serial.println("It is dark");
  else
    Serial.println("It is light");

  return lightState;
}

void sendData(float temperature, float tds, int ldr)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Create JSON
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = temperature;
    jsonDoc["tds"] = tds;
    jsonDoc["ldr"] = ldr;

    String jsonStr;
    serializeJson(jsonDoc, jsonStr);

    int httpResponseCode = http.POST(jsonStr);

    if (httpResponseCode > 0)
    {
      Serial.printf("POST... code: %d\n", httpResponseCode);
      String response = http.getString();
      Serial.println(response);
    }
    else
    {
      Serial.printf("POST... failed, error: %s\n", http.errorToString(httpResponseCode).c_str());
    }

    http.end();
  }
  else
  {
    Serial.println("WiFi not connected");
  }
}

int getMedianNum(int bArray[], int iFilterLen)
{
  int bTab[iFilterLen];
  for (int i = 0; i < iFilterLen; i++)
    bTab[i] = bArray[i];

  for (int j = 0; j < iFilterLen - 1; j++)
  {
    for (int i = 0; i < iFilterLen - j - 1; i++)
    {
      if (bTab[i] > bTab[i + 1])
      {
        int temp = bTab[i];
        bTab[i] = bTab[i + 1];
        bTab[i + 1] = temp;
      }
    }
  }

  if ((iFilterLen & 1) > 0)
    return bTab[iFilterLen / 2];
  else
    return (bTab[iFilterLen / 2] + bTab[iFilterLen / 2 - 1]) / 2;
}
