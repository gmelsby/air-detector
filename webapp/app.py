from flask import Flask, render_template
from db import get_connection

DB_PATH = '../quality.db'

app = Flask(__name__)

@app.route("/")
def index():
    db_conn = get_connection(DB_PATH)
    rows = db_conn.execute(
    '''
    SELECT datetime(dt, 'localtime') as local_time, * FROM Samples
    ORDER BY local_time DESC
    LIMIT 10
    ''').fetchall()
    db_conn.close()
    return render_template('table.html', rows=rows)
