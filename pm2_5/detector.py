import json
import sys
import argparse
import time
import board
import busio
import serial
import sqlite3
import os
from digitalio import DigitalInOut, Direction, Pull
from adafruit_pm25.uart import PM25_UART

# path to sqlite3 database
RELATIVE_DB_PATH = '../quality.db'
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

# Query to get the local time of the row with rowid
TIME_QUERY = '''
SELECT datetime(dt, 'localtime') as localTime
FROM Samples
WHERE rowid = ?
'''

def get_sensor():
    """
    returns a connection to the sensor
    """

    uart = serial.Serial("/dev/ttyS0", baudrate=9600, timeout=0.25)
    return PM25_UART(uart)

def get_reading(sensor, retries=5):
    """
    returns a dictionary of readings
    """

    for _ in range(retries):
        try:
            # if successful break out of retry loop
            return sensor.read()
        except RuntimeError:
            time.sleep(1)
            # want to retry until we get a reading
            continue

    raise RuntimeError('Unable to read from sensor')

def write_to_db(data, retries=3):
    """
    Connect to sqlite database
    Write reading and return row representing reading
    """

    # get absolute path
    path = os.path.abspath(__file__)
    dir_path = os.path.dirname(path)
    db_path = f'{dir_path}/{RELATIVE_DB_PATH}'

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    for _ in range(retries):
        try:
            # execute query
            cursor.execute(INSERTION_QUERY, data)
            # get last row id
            row_id = cursor.lastrowid
            # get localTime of inserted row
            localTimeRows = cursor.execute(TIME_QUERY, (row_id,))
            localTimeRow = cursor.fetchone()
            # commit insertion
            conn.commit()
            return localTimeRow[0]
        except sqlite3.Error as e:
            time.sleep(1)
            # retry until we write or run out of retries
            continue
        finally:
            conn.close()

        # raise error if unable to write to db even after retries
        raise RuntimeError(f'Error writing to database: {e}')

def main():
    # parse flags
    parser = argparse.ArgumentParser(
            prog='pm2_5',
            description='Reads the air quality and outputs a JSON represntation to stdout. Optionally saves it to a database')

    parser.add_argument('-v', '--verbose', action='store_true', help='If enabled, prints info about the status of the program')
    parser.add_argument('-s', '--save', action='store_true', help='If enabled, saves reading to a sqlite3 database')

    args = parser.parse_args()

    # connect to the sensor
    pm25 = get_sensor()

    # get the reading
    if args.verbose: print('reading from sensor')
    try:
        aqdata = get_reading(pm25)
    except RuntimeError as e:
        # exit if no reading
        print(e, sys.stderr)
        sys.exit(os.EX_UNAVAILABLE)


    # for JSON output
    data_dict = {
            'pm1': aqdata['pm10 standard'],
            'pm25': aqdata['pm25 standard'],
            'pm1env': aqdata['pm10 env'],
            'pm25env': aqdata['pm25 env'],
            'particles03' :aqdata['particles 03um'],
            'particles05': aqdata['particles 05um']
    }

    # save if flag specified
    if args.save:
        if args.verbose: print("writing values to database")
        try:
            result = write_to_db((
                data_dict['pm1'],
                data_dict['pm25'],
                data_dict['pm1env'],
                data_dict['pm25env'],
                data_dict['particles03'],
                data_dict['particles05']
                ))
        except RuntimeError as e:
            print(e, sys.stderr)
            sys.exit(os.EX_UNAVAILABLE)

        if args.verbose: print('successfully wrote to database')
        data_dict['localTime'] = result

    # output reading to stdout
    print(json.dumps(data_dict))

if __name__ == '__main__':
    main()
