#!/bin/bash

# Twitter Feedback Python Application Installation Script

set -e

echo "Twitter Feedback Python Application - Installation Script"
echo "========================================================="

# Check Python version
echo "Checking Python version..."
python3 --version || {
    echo "Error: Python 3 is not installed or not in PATH"
    exit 1
}

# Check for Python 3.8+
python3 -c "import sys; sys.exit(0 if sys.version_info >= (3, 8) else 1)" || {
    echo "Error: Python 3.8 or higher is required"
    exit 1
}

echo "✅ Python version check passed"

# Check if Gel is installed
echo "Checking Gel installation..."
if command -v gel >/dev/null 2>&1; then
    echo "✅ Gel is installed: $(gel --version)"
else
    echo "⚠️  Gel is not installed. Installing Gel..."
    # Install Gel (Linux/macOS)
    curl --proto '=https' --tlsv1.2 -sSfL https://geldata.com/sh | sh -s -- -y
    source "$HOME/.config/gel/env"
fi

# Create virtual environment
echo "Setting up Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

echo "✅ Virtual environment created and activated"

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

echo "✅ Dependencies installed"

# Set up Gel
echo "Setting up Gel database..."

# Create Gel instance
echo "Creating Gel instance..."
gel instance create twitter_feedback_python || echo "Instance may already exist"

# Create database
echo "Creating database..."
gel -I twitter_feedback_python database create gel || echo "Database may already exist"

# Run migrations
echo "Running database migrations..."
gel -I twitter_feedback_python migrate

echo "✅ Gel setup complete"

# Check for bearer token
echo "Checking for Twitter Bearer Token..."
if [ -f "../Twitter-bearer-token" ]; then
    echo "✅ Bearer token file found"
else
    echo "⚠️  Bearer token file not found at ../Twitter-bearer-token"
    echo "   Please create this file with your Twitter API v2 Bearer Token"
    echo "   Or set the TWITTER_BEARER_TOKEN environment variable"
fi

# Create logs directory
mkdir -p logs
echo "✅ Logs directory created"

echo ""
echo "Installation completed successfully! 🎉"
echo ""
echo "Next steps:"
echo "1. Ensure your Twitter Bearer Token is available:"
echo "   - File: ../Twitter-bearer-token"
echo "   - Or environment variable: TWITTER_BEARER_TOKEN"
echo ""
echo "2. Activate the virtual environment:"
echo "   source venv/bin/activate"
echo ""
echo "3. Run the application:"
echo "   python src/main.py user <username>"
echo ""
echo "4. Or try the examples:"
echo "   python examples/basic_usage.py"
echo ""
echo "For more information, see README.md"