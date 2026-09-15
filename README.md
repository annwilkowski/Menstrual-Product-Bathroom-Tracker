# Menstrual-Product-Bathroom-Tracker

Team Members:
- Anna Wilkowski (annaw7)
- Erin Rothenbaum (eroth8)
- Sarah Lau (lau29)

# Problem

Finding menstrual products on a college campus can be unexpectedly difficult. At UIUC, some bathrooms may have menstrual products available while others may be empty or not stocked at all. When someone unexpectedly needs a product, they may have to check multiple bathrooms or ask staff where products are located. This can be inconvenient, time-consuming, and especially frustrating when they are in a hurry.

There is currently no centralized way for students to determine which campus bathrooms have menstrual products available and how much stock remains.


# Solution

We propose an IoT-based system that monitors menstrual-product availability in bathrooms across UIUC and makes this information accessible through an app.

In boxes made specifically for the project, time-of-flight sensors would be installed on the inside of the lid; these sensors would bounce an IR light signal off the top of the period product stack, and use the time it takes for the signal to return to calculate the distance to the top of the stack from the lid.  We can use the inverse of that, i.e. the distance from the top of stack to the bottom of the box (total height - distance from top of stack to lid), to measure the total height of the stack and divide by the individual height of a pad container, confirming the amount of products available. This sensor would periodically transmit its measurements to a centralized server.

The mobile application would aggregate this information and display nearby bathrooms along with their estimated product availability. Users could quickly identify the closest bathroom with products rather than searching multiple locations.

The system could also provide useful information to campus facilities staff. When a bathroom's supply falls below a predefined threshold, the system could automatically flag the location for restocking.

# Solution Components

## Subsystem 1 - Menstrual Product Dispenser Box

Description:
This subsystem consists of a constructed box which holds the menstrual products. In a sense, it is meant to be a placeholder for the actual metal boxes used by the school to contain menstrual products, but can be its own standalone product. The bottom of the box may have a dispenser for products, or the lid will be removable. The lid of the box will have two Time-of-Flight sensors installed (for pads and tampons) on the underside to determine the height of the stack of menstrual items, and a transmission box installed on the side. 

Components:
 Time-Of-Flight Sensor: VL53L4CDV0DH (datasheet)  by STMicroelectronics
I2C interface: Up to 1 MHz (fast mode plus) serial bus, Address: 0x52 
Operating Voltage: 2.6 to 3.5 V 
4.4 x 2.4 x 1 mm size 
Operating Temperature: -30 to 85°C 
IR: 940 nm 
Minimum detection distance: 0mm, Minimum ranging distance with linear response: 1mm
90% detection rate at 450mm for low reflectance
Non-volatile memory

ALSO: Status indicator LEDs, RESET button

STRETCH: OLED display for showing the current projected number outside of the box. 



## Subsystem 2 - Transmission / Embedded System

The transmission box will contain an internet-connected module (Likely via Wifi as there are no ethernet cables in the restrooms).  ESP32 is needed to provide WiFi capabilities.  The transmission box may also contain other components such as an SD card to track product usage information and/or the last time a box was stocked. 

ESP32-S2 or S3: 
2.4 GHz Wi-Fi 4
BLE 5.0 (None if using S2)
240 MHz CPU
512 KB SRAM (320 if using S2)
Xtensa L7
USB On-The-Go
DAC converter (only if using S2)

ALSO:
Battery-or-USB power circuits with protection and automatic switching
Status indicator LEDs (For Power, WiFi Connection, I2C Rx/Tx)
RESET button
USB connection (firmware flash, power, data)

STRETCH: SD card to save user analytics



## Subsystem 3 - Phone App

The phone app will be able to display the location of restrooms with available menstrual products and the amount of pads and tampons available. The time of flight sensor will give an approximate estimation of the amount of products available. The mobile app would be created in Flutter or Android Studio.

There will be a hard-coded address added at the node level and sent over wifi as the first information bit (appended to the front of the I2C data).  This will allow for the app to use GPS to assign the location of the Data using the address and avoid too many WIFI protocols.



# Criterion For Success

Measure menstrual product levels using compact low-power ToF sensors
Detect product usage and restocking
Wirelessly transmit sensor data
Store and organize inventory data for each bathroom
Display bathroom locations and product availability on a mobile app
Show when inventory was last updatedAllow users to report inaccurate information
