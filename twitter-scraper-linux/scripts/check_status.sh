#!/bin/bash

# Twitter Scraper - Check Status
cd "$(dirname "$0")/.."

echo "📊 Twitter Scraper Linux - Status Check"

# Activate virtual environment
source venv/bin/activate

# Check status
python3 -m src.scheduler status