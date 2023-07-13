#!/bin/bash
script_directory=$(cd "`dirname "${BASH_SOURCE[0]}"`" ; pwd -P)
echo "starting detector..."
cd "$script_directory"/pm2_5
source .venv/bin/activate
nohup python3 detector.py &
deactivate

echo "starting web app"
cd "$script_directory"/webapp
source .venv/bin/activate
gunicorn --bind 0.0.0.0:8080 app:app --daemon
deactivate
