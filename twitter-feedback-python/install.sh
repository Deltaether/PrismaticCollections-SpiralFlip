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

# Check if EdgeDB is installed
echo "Checking EdgeDB installation..."
if command -v edgedb >/dev/null 2>&1; then
    echo "✅ EdgeDB is installed: $(edgedb --version)"
else
    echo "⚠️  EdgeDB is not installed. Installing EdgeDB..."
    # Install EdgeDB (Linux/macOS)
    curl --proto '=https' --tlsv1.2 -sSf https://sh.edgedb.com | sh
    export PATH="$HOME/.edgedb/bin:$PATH"
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

# Set up EdgeDB
echo "Setting up EdgeDB database..."

# Create EdgeDB instance
echo "Creating EdgeDB instance..."
edgedb instance create twitter_feedback || echo "Instance may already exist"

# Create database
echo "Creating database..."
edgedb -I twitter_feedback database create twitter_data || echo "Database may already exist"

# Run migrations
echo "Running database migrations..."
edgedb -I twitter_feedback -d twitter_data migrate

echo "✅ EdgeDB setup complete"

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