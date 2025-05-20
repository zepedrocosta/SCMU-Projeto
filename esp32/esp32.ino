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

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <secrets.h>

// GPIO Connections
#define TEMPERATURE_SENSOR 4 // DS18B20
#define TDS_SENSOR 34        // TDS Sensor
#define LDR_SENSOR 35        // LDR Sensor

#define VREF 3.3  // Reference voltage for the ADC
#define SCOUNT 30 // sum of sample point

// OLED display settings
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define VALUE_X 75       // X position of the value
#define START_Y 20       // first line below header
#define LINE_SPACING 9   // line spacing
#define OLED_RESET -1

OneWire oneWire(TEMPERATURE_SENSOR);
DallasTemperature sensors(&oneWire);

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, -1);

int analogBuffer[SCOUNT];

bool hasWiFi = false;
bool hasDisplay = false;

void setup()
{
  Serial.begin(9600);
  delay(2000);
  Serial.println("Initializing SCMU project!\n");
  sensors.begin();            // Inicia o sensor de temperatura
  pinMode(TDS_SENSOR, INPUT); // TDS
  pinMode(LDR_SENSOR, INPUT); // LDR

  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\nConnected to WiFi!\n");
    hasWiFi = true;
  }

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C)) // Address 0x3D for 128x64
  {
    Serial.println("SSD1306 allocation failed");
    Serial.println("Check if the display is connected correctly");
  }
  else
  {
    Serial.println("OLED display connected!\n");
    hasDisplay = true;
  }
}

void loop()
{
  float tempC = readTemperature();
  float tdsValue = readTDS(tempC);
  int hasLight = readLDR(); // 0 -> há luz / 1 -> não há luz

  if (hasDisplay)
    showData(tempC, tdsValue, hasLight);

  // if (hasWiFi)
  //   sendData(tempC, tdsValue, hasLight);

  Serial.println();

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
    // Create JSON
    StaticJsonDocument<200> jsonDoc;
    jsonDoc["temperature"] = temperature;
    jsonDoc["tds"] = tds;
    jsonDoc["ldr"] = ldr;

    String jsonStr;
    serializeJson(jsonDoc, jsonStr);

    Serial.println(jsonStr);

    HTTPClient http;
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

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

void showData(float temperature, float tds, int ldr)
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  printHeader();

  /* row 0 ─ Temperature */
  display.setCursor(0, START_Y + 0 * LINE_SPACING);
  display.print("Temperature:");
  display.setCursor(VALUE_X, START_Y + 0 * LINE_SPACING);
  display.print(temperature, 1); // 1 decimal
  display.print(" C");

  /* row 1 ─ TDS */
  display.setCursor(0, START_Y + 1 * LINE_SPACING);
  display.print("TDS Value:");
  display.setCursor(VALUE_X, START_Y + 1 * LINE_SPACING);
  display.print(tds, 0);
  display.print(" ppm");

  /* row 2 ─ LDR */
  display.setCursor(0, START_Y + 2 * LINE_SPACING);
  display.print("LDR State:");
  display.setCursor(VALUE_X, START_Y + 2 * LINE_SPACING);
  display.println(ldr == HIGH ? "Dark" : "Light");

  /* row 3 ─ pH */
  display.setCursor(0, START_Y + 3 * LINE_SPACING);
  display.print("pH:");
  display.setCursor(VALUE_X, START_Y + 3 * LINE_SPACING);
  display.print(404);

  /* row 4 ─ Depth */
  display.setCursor(0, START_Y + 4 * LINE_SPACING);
  display.print("Depth:");
  display.setCursor(VALUE_X, START_Y + 4 * LINE_SPACING);
  display.print(404);
  display.print(" cm");

  display.display();
}

void printHeader()
{
  const char *line1 = "Smart Aquarium";
  const char *line2 = "SCMU - 24/25";

  int16_t x1, y1;
  uint16_t w1, h1, w2, h2;

  // Measure text
  display.getTextBounds(line1, 0, 0, &x1, &y1, &w1, &h1);
  display.getTextBounds(line2, 0, 0, &x1, &y1, &w2, &h2);

  display.setCursor((SCREEN_WIDTH - w1) / 2, 0);
  display.println(line1);

  display.setCursor((SCREEN_WIDTH - w2) / 2, 10);
  display.println(line2);
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
