#!/bin/bash

# SSH Key Setup Script for Phantasia Server
# This script will copy the new SSH key to the server and set it up as default authentication

set -e

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="f8GrBWCk"
LOCAL_SSH_KEY="$HOME/.ssh/phantasia_server"
LOCAL_SSH_PUB="$HOME/.ssh/phantasia_server.pub"

echo "=== SSH Key Setup for Phantasia Server ==="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Local SSH Key: $LOCAL_SSH_KEY"
echo

# Check if local SSH key exists
if [[ ! -f "$LOCAL_SSH_KEY" ]]; then
    echo "❌ Error: SSH private key not found at $LOCAL_SSH_KEY"
    exit 1
fi

if [[ ! -f "$LOCAL_SSH_PUB" ]]; then
    echo "❌ Error: SSH public key not found at $LOCAL_SSH_PUB"
    exit 1
fi

echo "✅ Local SSH keys found"

# Test server connectivity
echo "🔍 Testing server connectivity..."
if ! ping -c 1 -W 3 "$SERVER_IP" &>/dev/null; then
    echo "❌ Error: Cannot reach server $SERVER_IP"
    echo "Please check:"
    echo "  - Server is running"
    echo "  - Network connectivity"
    echo "  - Firewall settings"
    exit 1
fi
echo "✅ Server is reachable"

# Check if sshpass is available
if ! command -v sshpass &>/dev/null; then
    echo "📦 Installing sshpass..."
    if command -v apt-get &>/dev/null; then
        sudo apt-get update && sudo apt-get install -y sshpass
    elif command -v yum &>/dev/null; then
        sudo yum install -y sshpass
    elif command -v pacman &>/dev/null; then
        sudo pacman -S sshpass
    else
        echo "❌ Error: Cannot install sshpass automatically"
        echo "Please install sshpass manually and run this script again"
        exit 1
    fi
fi

# Copy SSH key to server
echo "🔐 Copying SSH key to server..."
if sshpass -p "$SERVER_PASSWORD" ssh-copy-id -i "$LOCAL_SSH_PUB" -o StrictHostKeyChecking=no "$SERVER_USER@$SERVER_IP"; then
    echo "✅ SSH key copied successfully"
else
    echo "❌ Error: Failed to copy SSH key to server"
    exit 1
fi

# Test new SSH key authentication
echo "🧪 Testing SSH key authentication..."
if ssh -i "$LOCAL_SSH_KEY" -o StrictHostKeyChecking=no -o PasswordAuthentication=no "$SERVER_USER@$SERVER_IP" "echo 'SSH key authentication successful'"; then
    echo "✅ SSH key authentication working"
else
    echo "❌ Error: SSH key authentication failed"
    exit 1
fi

# Optional: Disable password authentication (uncomment to enable)
# echo "🔒 Disabling password authentication on server..."
# ssh -i "$LOCAL_SSH_KEY" "$SERVER_USER@$SERVER_IP" '
#     sed -i "s/#PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config
#     sed -i "s/PasswordAuthentication yes/PasswordAuthentication no/g" /etc/ssh/sshd_config
#     systemctl reload sshd
# '
# echo "✅ Password authentication disabled"

echo
echo "🎉 SSH Key Setup Complete!"
echo
echo "You can now connect to the server using:"
echo "  ssh $SERVER_USER@$SERVER_IP"
echo "  ssh phantasia-server"
echo
echo "The SSH key is configured as the default authentication method."

