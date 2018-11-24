#include <Wire.h>

// -- MPU6050 --
#include <MPU6050.h>
#define mpuSDA D5
#define mpuSDL D6
MPU6050 mpu;
Vector aclNormalizado;
Vector girNormalizado;

// --- NODEMCU ---
#include "ArduinoJson.h"
#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>
#include <ESP8266HTTPClient.h>

// ---- CONFIGURACAO REDE -----
const char* ssid = "";
const char* password = "";
const char* apiUrl = "";
WiFiClient nodemcuClient;
HTTPClient http;
StaticJsonBuffer<800> jsonBuffer;

// --- DISPLAY ---
#include "SSD1306Wire.h"
SSD1306Wire  display(0x3c, D1, D2);

// --- BUZZER ---
#define buzzer D0

void setup() {
  Serial.begin(115200);
  display.init();
  display.flipScreenVertically();
  pinMode(buzzer, OUTPUT);
  inicializarMPU();
  conectarWifi();
}

void loop() {
  consultarAPI();
  delay(600000); //10 minutos
}

void conectarWifi() {
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
  }
}

void inicializarMPU() {
  Wire.begin(mpuSDA, mpuSDL);

  while (!mpu.begin(MPU6050_SCALE_2000DPS, MPU6050_RANGE_2G)) {
    Serial.println("Could not find a valid MPU6050 sensor, check wiring!");
    delay(500);
  }

  mpu.calibrateGyro();
  mpu.setThreshold(3);
}


void consultarAPI() {
  if (WiFi.status() == WL_CONNECTED) {
    http.begin(apiUrl);
    int httpCode = http.GET();
    if (httpCode > 0) {
      String payload = http.getString();
      if (payload.length() > 0) {
        JsonArray& nodes = jsonBuffer.parseArray(payload);
        if (!nodes.success()) {
          Serial.println("parseObject() failed");
          jsonBuffer.clear();
        } else {
          int node_length = nodes.size();
          for (int i = 0; i < node_length; i++) {
            String nome = nodes[i]["nome"].as<const char*>();
            String numero = nodes[i]["numero"].as<const char*>();
            while (!verificarMovimentoMPU()) {
              ativarBuzzer();
              escreverNaTela(nome, numero);
            }
          }
        }
      }
    }
    http.end();
  } else {
    conectarWifi();
  }
}

bool verificarMovimentoMPU() {
  bool movimentoDetectado = false;
  aclNormalizado = mpu.readNormalizeAccel();

  if (aclNormalizado.XAxis < 10 && (aclNormalizado.YAxis > 30 || aclNormalizado.ZAxis > 30)) {
    Serial.print(" Entrou");
    movimentoDetectado = true;
  }

  return movimentoDetectado;
}

void ativarBuzzer() {
  tone(buzzer, 1500);
  delay(5000);
  noTone(buzzer);
}

void escreverNaTela(String nomeRedemedio, String numeroRemedio) {
  display.setFont(ArialMT_Plain_16);
  display.drawString(63, 10, nomeRedemedio);
  display.drawString(63, 26, numeroRemedio);
  display.display();
  delay(5000);
  apagarTextoDisplay();
}

void apagarTextoDisplay() {
  display.clear();
  display.setTextAlignment(TEXT_ALIGN_CENTER);
}




