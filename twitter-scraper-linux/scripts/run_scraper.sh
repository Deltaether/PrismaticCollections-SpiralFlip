#!/bin/bash

# Twitter Scraper - Run Once
cd "$(dirname "$0")/.."

echo "🐦 Twitter Scraper Linux - Running Once"

# Activate virtual environment
source venv/bin/activate

# Run the scraper
python3 -m src.scheduler run