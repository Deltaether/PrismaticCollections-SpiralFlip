#!/bin/bash

# Twitter Scraper - Start Daily Scheduler
cd "$(dirname "$0")/.."

echo "📅 Twitter Scraper Linux - Starting Daily Scheduler"

# Activate virtual environment
source venv/bin/activate

# Start the scheduler
python3 -m src.scheduler schedule