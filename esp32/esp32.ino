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
#include <BLEDevice.h>
#include <BLEServer.h>
#include <BLEUtils.h>
#include <BLE2902.h>

#include <HTTPClient.h>
#include <ArduinoJson.h>

#include <Wire.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>

#include <Preferences.h>

#include <pitches.h>
#include <CredentialsCallback.h>

// GPIO Connections
#define TEMPERATURE_SENSOR 4 // DS18B20
#define TDS_SENSOR 34        // TDS Sensor
#define LDR_SENSOR 35        // LDR Sensor
#define TRIG_PIN 12          // Ultrasonic Trigger Pin
#define ECHO_PIN 14          // Ultrasonic Echo Pin
#define PH_SENSOR 25         // pH Sensor
#define BUZZER_PIN 18        // Buzzer Pin
#define WATER_PUMP_PIN 19    // Water Pump Pin

#define VREF 3.3       // Reference voltage for the ADC
#define SAMPLES_TDS 30 // Number of samples for TDS
#define SAMPLES_PH 10  // Number of samples for pH

// OLED display settings
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 64 // OLED display height, in pixels
#define VALUE_X 75       // X position of the value
#define START_Y 20       // First line below header
#define LINE_SPACING 9   // Line spacing
#define OLED_RESET -1    // Reset pin # (or -1 if sharing Arduino reset pin)

#define DIST_ULTRA_TO_GROUND 21 // Distance from the ultrasonic sensor to the ground in cm
#define WIFI_BT_TIMEOUT 180000  // Bluetooth and Wi-Fi connection timeout in milliseconds (3 minutes)

#define SERVICE_UUID "bd8db997-757f-44b7-ad11-b81515927ca8"        // UUID for the BLE service
#define CHARACTERISTIC_UUID "6e4fe646-a8f0-4892-8ef4-9ac94142da48" // UUID for the BLE characteristic

#define SERVER_ENDPOINT "https://scmu.zepedrocosta.com/rest/aquariums/snapshot" // Server endpoint for sending data

OneWire oneWire(TEMPERATURE_SENSOR);
DallasTemperature sensors(&oneWire);

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire, OLED_RESET);

Preferences preferences;

TaskHandle_t setupTaskHandle = NULL;
TaskHandle_t initializationTaskHandle = NULL;

int tds_buf[SAMPLES_TDS];
int pH_buf[SAMPLES_PH];

float angle = 0;

volatile bool setupFinished = false; // Flag to indicate if setup is finished
bool hasWiFi = false;                // Flag to indicate if Wi-Fi is connected
bool hasDisplay = false;             // Flag to indicate if OLED display is connected
bool credentialsReceivedBT = false;  // Flag to indicate if credentials were received via Bluetooth
bool isBombWorking = false;          // Flag to indicate if the bomb is working
bool areValuesNormal = true;         // Flag to indicate if the values are normal

int nokiaMelody[] = {
    NOTE_E5, NOTE_D5, NOTE_FS4, NOTE_GS4,
    NOTE_CS5, NOTE_B4, NOTE_D4, NOTE_E4,
    NOTE_B4, NOTE_A4, NOTE_CS4, NOTE_E4,
    NOTE_A4};

int durations[] = {
    8, 8, 4, 4,
    8, 8, 4, 4,
    8, 8, 4, 4,
    2};

void setup()
{
  Serial.begin(9600);
  delay(2000); // Wait for serial monitor to open

  Serial.println("Initializing SCMU project!\n");

  if (!display.begin(SSD1306_SWITCHCAPVCC, 0x3C))
  {
    Serial.println("SSD1306 allocation failed");
    Serial.println("Check if the display is connected correctly");
  }
  else
  {
    Serial.println("OLED display connected!\n");
    hasDisplay = true;
    display.setRotation(2); // Rotate display to match the orientation
  }

  xTaskCreatePinnedToCore(setupTask, "SetupTask", 10000, NULL, 1, &setupTaskHandle, 0);
  xTaskCreatePinnedToCore(initializationTask, "InitializationScreen", 10000, NULL, 1, &initializationTaskHandle, 1);
}

void setupTask(void *parameter)
{
  sensors.begin();                   // Start DS18B20
  pinMode(TDS_SENSOR, INPUT);        // TDS
  pinMode(LDR_SENSOR, INPUT);        // LDR
  pinMode(ECHO_PIN, INPUT);          // Ultrasonic Echo Pin
  pinMode(BUZZER_PIN, OUTPUT);       // Buzzer Pin
  pinMode(TRIG_PIN, OUTPUT);         // Ultrasonic Trigger Pin
  pinMode(WATER_PUMP_PIN, OUTPUT);   // Water Pump Pin
  digitalWrite(WATER_PUMP_PIN, LOW); // Start with pump off

  String ssid, password;

  bool hasWiFiInfo = getWiFiInfo(ssid, password);

  if (hasWiFiInfo)
    connectToWiFi(ssid, password);

  setupFinished = true;
  vTaskDelete(NULL); // Ends setup task
}

bool getWiFiInfo(String &ssid, String &password)
{
  preferences.begin("wifi", false); // namespace = "wifi"

  preferences.clear(); // Uncomment this line to clear all stored WiFi credentials

  ssid = preferences.getString("ssid", "");
  password = preferences.getString("pass", "");

  if (ssid != "" && password != "")
  {
    Serial.println("Stored WiFi credentials found.");
  }
  else
  {
    Serial.println("No stored WiFi credentials found.");

    btConnect();

    ssid = preferences.getString("ssid", "");
    password = preferences.getString("pass", "");

    if (ssid == "" || password == "")
    {
      Serial.println("No WiFi credentials received via Bluetooth.\n\n");
      return false; // No credentials received
    }
    // Save them to NVS
    preferences.putString("ssid", ssid);
    preferences.putString("pass", password);
  }

  preferences.end();

  return ssid != "" && password != "";
}

void connectToWiFi(String &ssid, String &password)
{
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");

  unsigned long startAttemptTime = millis();

  while (WiFi.status() != WL_CONNECTED && millis() - startAttemptTime < WIFI_BT_TIMEOUT)
  {
    delay(3000);
    Serial.print(".");
  }

  if (WiFi.status() == WL_CONNECTED)
  {
    Serial.println("\nConnected to WiFi!\n");
    hasWiFi = true;
  }
  else
  {
    Serial.println("\nWi-Fi TIMEOUT!!!\n");
  }
}

void btConnect()
{
  BLEDevice::init("SmartAquarium");
  BLEServer *pServer = BLEDevice::createServer();
  BLEService *pService = pServer->createService(SERVICE_UUID);

  BLECharacteristic *pCharacteristic = pService->createCharacteristic(
      CHARACTERISTIC_UUID,
      BLECharacteristic::PROPERTY_WRITE | BLECharacteristic::PROPERTY_NOTIFY);

  pCharacteristic->addDescriptor(new BLE2902());
  pCharacteristic->setCallbacks(new CredentialsCallback());

  pService->start();

  BLEAdvertising *pAdvertising = BLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(SERVICE_UUID);
  pAdvertising->start();

  Serial.print("ESP32 is now advertising...");

  unsigned long startAttemptTime = millis();

  while (!credentialsReceivedBT && millis() - startAttemptTime < WIFI_BT_TIMEOUT)
  {
    delay(3000);
    Serial.print(".");
  }

  pAdvertising->stop();
  pServer->removeService(pService);
  BLEDevice::deinit(true);

  Serial.println("\nBLE shut down!\n");
}

void initializationTask(void *parameter)
{
  while (true)
  {
    if (setupFinished)
    {
      Serial.println("Setup task ended. Exiting other task...");
      vTaskDelete(NULL);
    }

    showInitialization();

    vTaskDelay(300 / portTICK_PERIOD_MS);
  }
}

void loop()
{
  if (setupFinished)
  {
    float tempC = readTemperature();
    float tdsValue = readTDS(tempC);
    int hasLight = readLDR(); // 0 -> light / 1 -> no light
    int depth = readDepth();
    float pHValue = readPh();

    if (hasDisplay)
      showData(tempC, tdsValue, hasLight, depth, pHValue);

    if (hasWiFi)
      sendData(tempC, tdsValue, hasLight, depth, pHValue);

    controlWaterPump();

    if (!areValuesNormal)
      singNokia();

    Serial.println();

    delay(2000); // espera 2 segundos entre leituras
  }
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
  for (int i = 0; i < SAMPLES_TDS; i++)
  {
    tds_buf[i] = analogRead(TDS_SENSOR);
    delay(2); // pequeno delay para estabilidade entre amostras (2 milissegundos)
  }

  int medianValue = getMedianNum(tds_buf, SAMPLES_TDS);
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

int readDepth()
{
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(5);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  long duration = pulseIn(ECHO_PIN, HIGH);
  long cm = microsecondsToCentimeters(duration); // Distance from the sensor to the water level

  int waterDepth = DIST_ULTRA_TO_GROUND - cm; // Distance from the water level to the ground

  Serial.print("Depth: ");
  Serial.print(waterDepth);
  Serial.println(" cm");

  return waterDepth;
}

float readPh()
{
  float calibration_value = 9.8;

  for (int i = 0; i < SAMPLES_PH; i++)
  {
    pH_buf[i] = analogRead(PH_SENSOR);
    delay(30);
  }

  int medianValue = getMedianNum(pH_buf, SAMPLES_PH);

  float volt = (float)medianValue * VREF / 4096.0 / 6;
  float pH = -5.70 * volt + calibration_value;

  Serial.print("pH: ");
  Serial.println(pH);

  return pH;
}

void sendData(float temperature, float tds, int ldr, int depth, float pH)
{
  if (WiFi.status() == WL_CONNECTED)
  {
    // Create JSON
    StaticJsonDocument<200> jsonDoc;

    jsonDoc["temperature"] = temperature;
    jsonDoc["tds"] = tds;
    jsonDoc["ldr"] = ldr;
    jsonDoc["depth"] = depth;
    jsonDoc["ph"] = pH;

    String jsonStr;
    serializeJson(jsonDoc, jsonStr);

    Serial.println(jsonStr);

    HTTPClient http;
    http.begin(SERVER_ENDPOINT);
    http.addHeader("Content-Type", "application/json");

    int httpResponseCode = http.POST(jsonStr);

    if (httpResponseCode > 0)
    {
      Serial.printf("POST... code: %d\n", httpResponseCode);
      String response = http.getString();
      analyseResponse(response);
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

void analyseResponse(String response)
{
  StaticJsonDocument<200> jsonDoc;
  DeserializationError error = deserializeJson(jsonDoc, response);

  if (error)
  {
    Serial.print("deserializeJson() failed: ");
    Serial.println(error.f_str());
    return;
  }

  if (jsonDoc.containsKey("isBombWorking"))
  {
    isBombWorking = jsonDoc["isBombWorking"];
  }

  if (jsonDoc.containsKey("areValuesNormal"))
  {
    areValuesNormal = jsonDoc["areValuesNormal"];
  }
}

void showData(float temperature, float tds, int ldr, int depth, float pH)
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  printHeader();

  int row = 0;

  // row 0 ─ Temperature
  display.setCursor(0, START_Y + row * LINE_SPACING);
  display.print("Temperature:");
  display.setCursor(VALUE_X, START_Y + row * LINE_SPACING);
  display.print(temperature, 1);
  display.print(" C");

  row++;

  // row 1 ─ TDS
  display.setCursor(0, START_Y + row * LINE_SPACING);
  display.print("TDS Value:");
  display.setCursor(VALUE_X, START_Y + row * LINE_SPACING);
  display.print(tds, 0);
  display.print(" ppm");

  row++;

  // row 2 ─ LDR
  display.setCursor(0, START_Y + row * LINE_SPACING);
  display.print("LDR State:");
  display.setCursor(VALUE_X, START_Y + row * LINE_SPACING);
  display.println(ldr == HIGH ? "Dark" : "Light");

  row++;

  // row 3 ─ pH
  display.setCursor(0, START_Y + row * LINE_SPACING);
  display.print("pH:");
  display.setCursor(VALUE_X, START_Y + row * LINE_SPACING);
  display.print(pH, 2);

  row++;

  // row 4 ─ Depth
  display.setCursor(0, START_Y + row * LINE_SPACING);
  display.print("Depth:");
  display.setCursor(VALUE_X, START_Y + row * LINE_SPACING);
  display.print(depth);
  display.print(" cm");

  display.display();
}

void showInitialization()
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);

  printHeader();

  int cx = SCREEN_WIDTH / 2;
  int cy = (SCREEN_HEIGHT / 2) + 10;
  int r = 12;

  display.drawCircle(cx, cy, r, SSD1306_WHITE);

  float x = cx + r * cos(angle);
  float y = cy + r * sin(angle);
  display.drawLine(cx, cy, (int)x, (int)y, SSD1306_WHITE);

  display.display();

  angle += 0.2;
  if (angle > 2 * PI)
    angle = 0;

  delay(50);
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

long microsecondsToCentimeters(long microseconds)
{
  return (microseconds / 29.1) / 2;
}

void controlWaterPump()
{
  if (isBombWorking)
  {
    Serial.println("Water pump ON!");
    digitalWrite(WATER_PUMP_PIN, HIGH);
  }
  else
  {
    digitalWrite(WATER_PUMP_PIN, LOW);
  }
}

void singNokia()
{
  int size = sizeof(durations) / sizeof(int);

  for (int note = 0; note < size; note++)
  {
    int duration = 1000 / durations[note];
    tone(BUZZER_PIN, nokiaMelody[note], duration);

    int pauseBetweenNotes = duration * 1.30;
    delay(pauseBetweenNotes);

    // stop the tone playing:
    noTone(BUZZER_PIN);
  }
}