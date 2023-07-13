import time
import board
import busio
import serial
import sqlite3
from digitalio import DigitalInOut, Direction, Pull
from adafruit_pm25.uart import PM25_UART

# path to sqlite3 database
DB_PATH = '../quality.db'
# minutes to sleep between measurements
MIN_INTERVAL = 1/60 

# query to use when inserting data into db 
INSERTION_QUERY = '''
INSERT INTO Samples
Values(
datetime('now'),
?,
?,
?,
?,
?,
?
)
'''



# For use with Raspberry Pi/Linux:
uart = serial.Serial("/dev/ttyS0", baudrate=9600, timeout=0.25)
# Connect to a PM2.5 sensor over UART
pm25 = PM25_UART(uart)
print("Found PM2.5 sensor, reading data...")

while True:

    try:
        aqdata = pm25.read()
    except RuntimeError:
        print("Unable to read from sensor, retrying...")
        continue

    print("Writing values to database")

    # Connect to sqlite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    data = (
        aqdata["pm10 standard"],
        aqdata["pm25 standard"],
        aqdata["pm10 env"],
        aqdata["pm25 env"],
        aqdata["particles 03um"],
        aqdata["particles 05um"]
    )
    try:
        # execute query
        cursor.execute(INSERTION_QUERY, data)
        # commit insertion
        conn.commit()
    except sqlite3.Error as e:
        print(f'Error writing to database: {e}')
        continue

    finally:
        conn.close()

    print('successfully wrote to database')
    # wait the specified number of minutes
    time.sleep(60 * MIN_INTERVAL)

