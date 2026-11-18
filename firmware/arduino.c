
#include <stdio.h>
#include <stdlib.h>
#include <inttypes.h>
#include <string.h>
#include <WiFi.h>
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "freertos/queue.h"
#include "esp_mac.h"
#include "esp_wifi.h"
#include "esp_event.h"
#include "esp_log.h"
#include "nvs_flash.h"
#include "driver/gpio.h"

#include "lwip/err.h"
#include "lwip/sys.h"

#include <Arduino.h>

#define PROX_SENSE_LED              1
#define DIST_SENSE_LED_G            41
#define DIST_SENSE_LED_Y            42
#define DIST_SENSE_LED_R            2

#define PROX_OUTPUT                 8
#define DIST_ECHO                   5
#define DIST_TRIG                   4

#define SOUND_SPEED                 0.034
#define CM_TO_INCH                  0.393701

long duration;
float distanceCm;


void WiFiEvent(WiFiEvent_t event) {
    switch (event) {
        case ARDUINO_EVENT_WIFI_AP_STACONNECTED:
            Serial.println("A device connected to ESP32 WiFi!");
            break;

        case ARDUINO_EVENT_WIFI_AP_STADISCONNECTED:
            Serial.println("A device disconnected from ESP32 WiFi!");
            break;

        default:
            break;
    }
}


void setup(){
    pinMode(PROX_SENSE_LED, OUTPUT);
    pinMode(DIST_SENSE_LED_G, OUTPUT);
    pinMode(DIST_SENSE_LED_R, OUTPUT);
    pinMode(DIST_SENSE_LED_Y, OUTPUT);

    digitalWrite(DIST_SENSE_LED_G, LOW);
    digitalWrite(DIST_SENSE_LED_Y, LOW);
    digitalWrite(DIST_SENSE_LED_R, HIGH);

    pinMode(PROX_OUTPUT, INPUT);
    pinMode(DIST_ECHO, INPUT);
    pinMode(DIST_TRIG, OUTPUT);
    Serial.begin(115200);

    WiFi.onEvent(WiFiEvent);
    WiFi.mode(WIFI_AP);

    if (WiFi.softAP("ESP32_Sensor", "password123")) {
        Serial.println("WiFi access point started!");
        Serial.print("IP Address: ");
        Serial.println(WiFi.softAPIP());
    } else {
        Serial.println("WiFi access point failed!");
    }
}


void loop(){

    digitalWrite(DIST_TRIG, LOW);
    delayMicroseconds(2);
    digitalWrite(DIST_TRIG, HIGH);
    delayMicroseconds(10);
    digitalWrite(DIST_TRIG, LOW);

    duration = pulseIn(DIST_ECHO, HIGH, 30000);
    distanceCm = (duration*.0343) / 2;

    if(distanceCm <= 5){
        digitalWrite(DIST_SENSE_LED_G, HIGH);
        digitalWrite(DIST_SENSE_LED_Y, HIGH);
        digitalWrite(DIST_SENSE_LED_R, HIGH);
    }
    else if (distanceCm <= 10 && distanceCm > 5){
        digitalWrite(DIST_SENSE_LED_G, LOW);
        digitalWrite(DIST_SENSE_LED_Y, HIGH);
        digitalWrite(DIST_SENSE_LED_R, HIGH);
    }
    else{
        digitalWrite(DIST_SENSE_LED_G, LOW);
        digitalWrite(DIST_SENSE_LED_Y, LOW);
        digitalWrite(DIST_SENSE_LED_R, HIGH); 
    }
    Serial.print("Distance: ");
    Serial.print(distanceCm, 2); // 2 means # of decimal digits
    Serial.println(" cm");

    digitalWrite(PROX_SENSE_LED, HIGH);
    delay(500);
    digitalWrite(PROX_SENSE_LED, LOW);
    delay(500);
}