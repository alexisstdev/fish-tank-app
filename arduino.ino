#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <OneWire.h>
#include <DallasTemperature.h>
 
const char* ssid = "INFINITUM6A51";
const char* password = "Zx6Bb2Vr8q";
 
// Dirección del servidor Node.js
const char* serverUrl = "http://192.168.1.100:3000/envio/temperatura"; // Cambia la IP por la de tu servidor
 
// Pin del sensor DS18B20
#define ONE_WIRE_BUS 4 // Cambia este número si usas otro pin
 
// Instancia OneWire y DallasTemperature
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);
 
void setup() {
  Serial.begin(115200);
  delay(10);
 
  // Iniciar conexión WiFi
  Serial.print("Conectando a WiFi...");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado a WiFi");
  Serial.print("Dirección IP: ");
  Serial.println(WiFi.localIP());
 
  // Iniciar el sensor DS18B20
  sensors.begin();
}
 
void loop() {
  // Lee la temperatura
  sensors.requestTemperatures();
  float temperatureC = sensors.getTempCByIndex(0); // Lee la primera dirección del sensor
 
  // Verifica que el sensor está funcionando
  if (temperatureC == DEVICE_DISCONNECTED_C) {
    Serial.println("Error: No se puede leer el sensor DS18B20");
    return;
  }
 
  Serial.print("Temperatura: ");
  Serial.println(temperatureC);
 
  // Enviar datos al servidor
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
 
    // Crear el payload JSON
    String jsonPayload = "{\"temperatura\":" + String(temperatureC) + "}";
 
    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");
 
    int httpResponseCode = http.POST(jsonPayload); // Enviar datos
    if (httpResponseCode > 0) {
      Serial.print("Respuesta del servidor: ");
      Serial.println(httpResponseCode);
      String response = http.getString();
      Serial.println("Cuerpo de respuesta:");
      Serial.println(response);
    } else {
      Serial.print("Error en la solicitud HTTP: ");
      Serial.println(httpResponseCode);
    }
 
    http.end();
  } else {
    Serial.println("Error: No conectado a WiFi");
  }
 
  delay(5000); // Enviar datos cada 5 segundos
}
 
