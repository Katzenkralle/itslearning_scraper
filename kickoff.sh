#!/bin/bash
cd /
gunicorn --bind 127.0.0.1:8000  its_learning_scraper.wsgi:application --pythonpath its_learning_scraper &
nginx -g "daemon off;"