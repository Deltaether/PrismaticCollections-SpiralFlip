#!/bin/bash

# SSH Password Authentication Restoration Script
# Run this script on the remote server to restore password login

echo "=== SSH Password Authentication Restoration ==="
echo "This script will restore password authentication for SSH"
echo

# Backup current SSH config
echo "1. Creating backup of current SSH config..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup.$(date +%Y%m%d_%H%M%S)
echo "✅ Backup created"

# Show current SSH config
echo
echo "2. Current SSH configuration:"
echo "----------------------------------------"
grep -E "(PasswordAuthentication|PermitRootLogin|Port)" /etc/ssh/sshd_config
echo "----------------------------------------"

# Enable password authentication
echo
echo "3. Enabling password authentication..."

# Remove any existing PasswordAuthentication lines and add the correct one
sed -i '/^#*PasswordAuthentication/d' /etc/ssh/sshd_config
echo "PasswordAuthentication yes" >> /etc/ssh/sshd_config

# Ensure root login is permitted (if needed)
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin yes/' /etc/ssh/sshd_config

# Ensure SSH is on port 22
sed -i 's/^#*Port.*/Port 22/' /etc/ssh/sshd_config

echo "✅ SSH configuration updated"

# Show updated config
echo
echo "4. Updated SSH configuration:"
echo "----------------------------------------"
grep -E "(PasswordAuthentication|PermitRootLogin|Port)" /etc/ssh/sshd_config
echo "----------------------------------------"

# Test SSH config syntax
echo
echo "5. Testing SSH configuration syntax..."
if sshd -t; then
    echo "✅ SSH configuration syntax is valid"
else
    echo "❌ SSH configuration has syntax errors!"
    echo "Restoring backup..."
    cp /etc/ssh/sshd_config.backup.* /etc/ssh/sshd_config
    exit 1
fi

# Restart SSH service
echo
echo "6. Restarting SSH service..."
if systemctl restart sshd; then
    echo "✅ SSH service restarted successfully"
elif systemctl restart ssh; then
    echo "✅ SSH service restarted successfully"
else
    echo "❌ Failed to restart SSH service"
    echo "Trying manual restart..."
    service ssh restart
fi

# Check SSH service status
echo
echo "7. SSH service status:"
systemctl status sshd --no-pager -l || systemctl status ssh --no-pager -l

echo
echo "🎉 SSH Password Authentication Restoration Complete!"
echo
echo "You should now be able to connect using:"
echo "  ssh root@212.227.85.148"
echo "  (with password: f8GrBWCk)"
echo
echo "⚠️  Important Notes:"
echo "  - Password authentication is now enabled"
echo "  - Root login is permitted"
echo "  - SSH is running on port 22"
echo "  - A backup of the original config was created"
echo