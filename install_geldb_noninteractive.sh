#!/bin/bash

# Non-interactive GelDB Installation Script
# This script installs GelDB without any prompts

echo "Installing GelDB non-interactively..."

# Set environment variables for non-interactive installation
export GELDB_INSTALL_PATH="/root/.local/bin"
export GELDB_MODIFY_PATH="no"
export GELDB_CONFIRM_INSTALL="yes"

# Download and run installer with predefined responses
curl https://www.geldata.com/sh --proto "=https" -sSf1 | bash -s -- --non-interactive

# Alternatively, if the above doesn't work, use expect with specific responses
if ! command -v gel &> /dev/null; then
    echo "Trying alternative installation method..."

    # Download installer
    curl https://www.geldata.com/sh --proto "=https" -sSf1 -o /tmp/geldb_installer.sh
    chmod +x /tmp/geldb_installer.sh

    # Use printf to pipe responses
    printf "1\n" | bash /tmp/geldb_installer.sh

    # If still not working, use expect
    if ! command -v gel &> /dev/null; then
        expect << 'EOF'
set timeout 60
spawn bash /tmp/geldb_installer.sh

expect {
    "*1) Proceed with installation (default)*" {
        send "1\r"
        exp_continue
    }
    "*2) Customize installation*" {
        send "1\r"
        exp_continue
    }
    "*3) Cancel installation*" {
        send "1\r"
        exp_continue
    }
    "*default*" {
        send "\r"
        exp_continue
    }
    eof
}
EOF
    fi
fi

# Add to PATH
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
export PATH="$HOME/.local/bin:$PATH"

# Verify installation
if command -v gel &> /dev/null; then
    echo "✅ GelDB installed successfully: $(gel --version)"
    gel --version
else
    echo "❌ GelDB installation failed, trying manual download..."

    # Manual installation as fallback
    mkdir -p ~/.local/bin

    # Try to download the binary directly (if available)
    ARCH=$(uname -m)
    OS=$(uname -s | tr '[:upper:]' '[:lower:]')

    echo "System: $OS $ARCH"
    echo "⚠️ Manual installation may be needed"
    echo "Please visit: https://www.geldata.com for manual installation instructions"
fi