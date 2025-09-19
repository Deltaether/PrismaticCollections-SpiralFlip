#!/bin/bash

# Server connection and setup script
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="Kd7bY1mQ"
SSH_KEY_PATH="/home/delta/.ssh/phantasia_server"
SSH_PUB_PATH="/home/delta/.ssh/phantasia_server.pub"

echo "=== Connecting to Reset Server and Setting Up SSH Keys ==="
echo "Server: $SERVER_USER@$SERVER_IP"
echo "Password: $SERVER_PASSWORD"
echo

# Try to connect and run setup commands
cat << 'EOF' > /tmp/server_setup_commands.sh
#!/bin/bash

echo "=== Connected to server successfully! ==="
echo "Server: $(hostname)"
echo "Date: $(date)"
echo "User: $(whoami)"
echo

echo "=== System Information ==="
cat /etc/os-release | head -5
echo "Uptime: $(uptime)"
echo

echo "=== Updating system packages ==="
apt update
echo "✅ Package list updated"

echo "=== Upgrading system packages ==="
apt upgrade -y
echo "✅ System packages upgraded"

echo "=== Installing essential packages ==="
apt install -y curl wget git nano htop unzip
echo "✅ Essential packages installed"

echo "=== Setting up SSH directory ==="
mkdir -p ~/.ssh
chmod 700 ~/.ssh
echo "✅ SSH directory created"

echo "=== Current SSH config ==="
grep -E "(PasswordAuthentication|PermitRootLogin|Port)" /etc/ssh/sshd_config || echo "No specific SSH config found"

echo "=== Ready for SSH key setup ==="
echo "Now you can add the SSH public key to ~/.ssh/authorized_keys"
echo "The directory ~/.ssh is ready with correct permissions"

EOF

chmod +x /tmp/server_setup_commands.sh

echo "Connecting to server and running setup..."
echo "You will need to enter the password: $SERVER_PASSWORD"
echo

# Copy the setup script and execute it
scp -o StrictHostKeyChecking=no /tmp/server_setup_commands.sh root@$SERVER_IP:/tmp/
ssh -o StrictHostKeyChecking=no root@$SERVER_IP 'bash /tmp/server_setup_commands.sh'