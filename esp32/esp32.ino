#include <OneWire.h>
#include <DallasTemperature.h>

// GPIO Connections
#define TEMPERATURE_SENSOR 4 // DS18B20
#define TdsSensorPin 34 // TDS Sensor 

OneWire oneWire(TEMPERATURE_SENSOR);
DallasTemperature sensors(&oneWire);

#define VREF 3.3
#define SCOUNT 30

int analogBuffer[SCOUNT];

void setup()
{
  Serial.begin(9600);
  sensors.begin(); // Inicia o sensor de temperatura
  pinMode(TdsSensorPin, INPUT); // TDS
}

void loop()
{
  float tempC = readTemperature();
  float tdsValue = readTDS(tempC);

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
    analogBuffer[i] = analogRead(TdsSensorPin);
    delay(2); // pequeno delay para estabilidade entre amostras
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
