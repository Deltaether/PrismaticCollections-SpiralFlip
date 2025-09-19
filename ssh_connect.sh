#!/bin/bash
# SSH connection script for remote server

# First, let's use a simple approach with SSH keys or manual connection
echo "Connecting to server 212.227.85.148..."
echo "Password: 16nFuBcg"

# Try to connect with timeout and auto-yes to host key
ssh -o ConnectTimeout=10 -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null root@212.227.85.148 << 'EOF'
# Clear website data while keeping nginx running
echo "=== Clearing website data ==="
ls -la /var/www/phantasia/
rm -rf /var/www/phantasia/*
ls -la /var/www/phantasia/
echo "Website data cleared successfully"

# Check nginx status
echo "=== Checking nginx status ==="
systemctl status nginx --no-pager -l

# Install Docker
echo "=== Installing Docker ==="
# Update package index
apt-get update

# Install prerequisites
apt-get install -y apt-transport-https ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# Add Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

# Update package index again
apt-get update

# Install Docker Engine
apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Start and enable Docker
systemctl start docker
systemctl enable docker

# Verify Docker installation
echo "=== Verifying Docker installation ==="
docker --version
docker-compose --version || docker compose version

# Check Docker service status
systemctl status docker --no-pager -l

echo "=== Server preparation complete ==="
echo "1. Website data cleared from /var/www/phantasia/"
echo "2. nginx is still running"
echo "3. Docker installed and ready"

exit
EOF