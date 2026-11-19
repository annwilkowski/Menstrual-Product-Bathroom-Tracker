/* This example shows how to use continuous mode to take
range measurements with the VL53L0X. It is based on
vl53l0x_ContinuousRanging_Example.c from the VL53L0X API.

The range readings are in units of mm. */

#include <Wire.h>
#include <VL53L0X.h>

#define MM_TO_INCH  2540
#define EMPTY_STACK 9.875 // Distance in inches


VL53L0X sensor[2]; // 1 = pads, 2 = tampons
uint16_t dist[2]; // Distance from sensor to product
uint8_t item_count[2]; // current item count
uint8_t prev_item_count[2]; // previous item count

void setup()
{
    Serial.begin(9600);
    Wire.begin();

    for(int i=0; i<2; i++){
        sensor[i].setTimeout(500);
        if (!sensor[i].init())
        {
            Serial.println("Failed to detect and initialize sensor!");
            while (1) {}
        }
        // Start continuous back-to-back mode (take readings as
        // fast as possible).  To use continuous timed mode
        // instead, provide a desired inter-measurement period in
        // ms (e.g. sensor.startContinuous(100)).
        // sensor[i].startContinuous();
    }
    #if defined LONG_RANGE
    // lower the return signal rate limit (default is 0.25 MCPS)
    sensor.setSignalRateLimit(0.1);
    // increase laser pulse periods (defaults are 14 and 10 PCLKs)
    sensor.setVcselPulsePeriod(VL53L0X::VcselPeriodPreRange, 18);
    sensor.setVcselPulsePeriod(VL53L0X::VcselPeriodFinalRange, 14);
    #endif

    #if defined HIGH_SPEED
    // reduce timing budget to 20 ms (default is about 33 ms)
    sensor.setMeasurementTimingBudget(20000);
    #elif defined HIGH_ACCURACY
    // increase timing budget to 200 ms
    sensor.setMeasurementTimingBudget(200000);
    #endif   
}

void loop()
{
    // Serial.print(sensor.readRangeContinuousMillimeters());
    // if (sensor.timeoutOccurred()) { Serial.print(" TIMEOUT"); }
    for(int i = 0; i<2; i++){
        prev_item_count[i] = item_count[i];
        dist[i] = sensor[i].readRangeSingleMillimeters();
        if(i){
            item_count[i] = (EMPTY_STACK - dist[i]/MM_TO_INCH)/0.625; // diameter of tampon is 0.625"
        } else {
            item_count[i] = (EMPTY_STACK - dist[i]/MM_TO_INCH); // height of pad is 1"
        }
    }

    if((item_count[0] != prev_item_count[0])){
        Serial.print("Pad stack height: ");
        Serial.println(item_count[0]);
    }

    if((item_count[1] != prev_item_count[1])){
        Serial.print("Tampon stack height: ");
        Serial.println(item_count[1]);
    }
    if (sensor.timeoutOccurred()) { Serial.print(" TIMEOUT"); }
    
    sleep(300); // uncomment for testing
}