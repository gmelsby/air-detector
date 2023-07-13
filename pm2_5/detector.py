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
MIN_INTERVAL = 5 

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

def get_sensor():
   # returns a connection to the sensor
    uart = serial.Serial("/dev/ttyS0", baudrate=9600, timeout=0.25)
    return PM25_UART(uart)
    print("Found PM2.5 sensor, reading data...")

def get_reading(sensor, retries=10):
    # returns a dictionary of readings
    for _ in range(retries):
        try:
            # if successful break out of retry loop
            return sensor.read()
        except RuntimeError:
            print("Unable to read from sensor, retrying...")
            time.sleep(1)
            # want to retry until we get a reading
            continue

    raise RuntimeError('Unable to read from sensor')

def write_to_db(data, retries=10):
    # Connect to sqlite database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    for _ in range(retries):
        try:
            # execute query
            cursor.execute(INSERTION_QUERY, data)
            # commit insertion
            conn.commit()
            return
        except sqlite3.Error as e:
            print(f'Error writing to database: {e}')
            continue

        finally:
            conn.close()

def main():
    # connect to the sensor
    pm25 = get_sensor()

    # get the reading
    try:
        aqdata = get_reading(pm25)
    except RuntimeError as e:
        # exit if no reading
        print(e)
        return

    print("Writing values to database")
    data = (
        aqdata["pm10 standard"],
        aqdata["pm25 standard"],
        aqdata["pm10 env"],
        aqdata["pm25 env"],
        aqdata["particles 03um"],
        aqdata["particles 05um"]
    )
    write_to_db(data)

    print('successfully wrote to database')

if __name__ == '__main__':
    main()
