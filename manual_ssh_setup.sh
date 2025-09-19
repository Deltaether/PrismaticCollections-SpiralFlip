#!/bin/bash

# Manual SSH Setup Script
# This script will guide you through setting up SSH keys manually

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="f8GrBWCk"  # From the remote file
LOCAL_SSH_KEY="$HOME/.ssh/phantasia_server"
LOCAL_SSH_PUB="$HOME/.ssh/phantasia_server.pub"

echo "=== Manual SSH Key Setup for Phantasia Server ==="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Password: $SERVER_PASSWORD"
echo
echo "1. The SSH public key content is:"
echo "----------------------------------------"
cat "$LOCAL_SSH_PUB"
echo "----------------------------------------"
echo
echo "2. To manually set up SSH keys, you need to:"
echo "   a) Connect to the server manually with password: ssh root@$SERVER_IP"
echo "   b) Create ~/.ssh directory: mkdir -p ~/.ssh"
echo "   c) Add the public key to authorized_keys: echo 'PUBLIC_KEY_CONTENT' >> ~/.ssh/authorized_keys"
echo "   d) Set correct permissions: chmod 700 ~/.ssh && chmod 600 ~/.ssh/authorized_keys"
echo
echo "3. Or run this command on the server to add the key:"
echo "echo '$(cat $LOCAL_SSH_PUB)' >> ~/.ssh/authorized_keys"
echo
echo "4. Test connection after setup with:"
echo "ssh -i $LOCAL_SSH_KEY root@$SERVER_IP"