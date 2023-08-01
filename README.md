# Raspberry Pi Air Quality Montior
### Full-stack local IOT air quality monitor that runs on a Raspberry Pi.
Required materials
- [Plantower PM2.5 Air Quality Sensor](https://learn.adafruit.com/pm25-air-quality-sensor)
- Raspberry Pi (Only tested with the Pi Zero W, but any model after the Pi 1 Model B _should_ work--no guarantees though)  
### Consists of 
- cron job Python script for reading data
- SQLite database for storing data
- Go chi API for retrieving stored data and creating current readings
- Preact client for displaying readings

### Screenshots of Web Interface
| ![Live Readings](screenshots/Live%20Readings.png) |
|:--:|
| *Live Readings (updates every 5s)* |

| ![Recent Readings Table](screenshots/Table.png) |
|:--:|
| *Recent Readings Table* |

| ![Equivalent AQI](screenshots/AQI%20Graph.png) |
|:--:|
| *Equivalent AQI Graph* |

| ![PM 1.0 and 2.5 Graph](screenshots/PM%20Graph.png) |
|:--:|
| *PM 1.0 and 2.5 Graph* |
