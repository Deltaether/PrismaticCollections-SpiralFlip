#!/bin/bash

# Manual Server Setup Guide
echo "======================================================================"
echo "MANUAL SERVER SETUP GUIDE"
echo "======================================================================"
echo
echo "Server Details:"
echo "  IP: 212.227.85.148"
echo "  User: root"
echo "  Password: Kd7bY1mQ"
echo
echo "SSH Key Details:"
echo "  Private Key: ~/.ssh/phantasia_server"
echo "  Public Key: ~/.ssh/phantasia_server.pub"
echo

# Show the public key content
echo "======================================================================"
echo "SSH PUBLIC KEY TO INSTALL ON SERVER:"
echo "======================================================================"
cat ~/.ssh/phantasia_server.pub
echo
echo "======================================================================"

echo
echo "STEP-BY-STEP INSTRUCTIONS:"
echo "======================================================================"
echo
echo "1. CONNECT TO SERVER MANUALLY:"
echo "   ssh root@212.227.85.148"
echo "   (Enter password when prompted: Kd7bY1mQ)"
echo
echo "2. UPDATE THE SERVER:"
echo "   apt update && apt upgrade -y"
echo
echo "3. INSTALL ESSENTIAL PACKAGES:"
echo "   apt install -y curl wget git nano htop unzip"
echo
echo "4. SET UP SSH DIRECTORY:"
echo "   mkdir -p ~/.ssh"
echo "   chmod 700 ~/.ssh"
echo
echo "5. ADD THE SSH PUBLIC KEY:"
echo "   nano ~/.ssh/authorized_keys"
echo "   (Copy and paste the public key shown above)"
echo
echo "   OR use this one-liner:"
echo "   echo '$(cat ~/.ssh/phantasia_server.pub)' >> ~/.ssh/authorized_keys"
echo
echo "6. SET CORRECT PERMISSIONS:"
echo "   chmod 600 ~/.ssh/authorized_keys"
echo
echo "7. VERIFY SSH CONFIG (KEEP PASSWORD AUTH ENABLED):"
echo "   nano /etc/ssh/sshd_config"
echo "   Make sure these lines exist:"
echo "     PasswordAuthentication yes"
echo "     PubkeyAuthentication yes"
echo "     AuthorizedKeysFile .ssh/authorized_keys"
echo
echo "8. RESTART SSH SERVICE:"
echo "   systemctl restart sshd"
echo
echo "9. TEST SSH KEY FROM LOCAL MACHINE (open new terminal):"
echo "   ssh -i ~/.ssh/phantasia_server root@212.227.85.148"
echo
echo "10. VERIFY BOTH METHODS WORK:"
echo "    - SSH key: ssh -i ~/.ssh/phantasia_server root@212.227.85.148"
echo "    - Password: ssh root@212.227.85.148 (then enter password)"
echo
echo "======================================================================"
echo "TROUBLESHOOTING:"
echo "======================================================================"
echo
echo "If SSH key doesn't work:"
echo "  - Check permissions: ls -la ~/.ssh/"
echo "  - Check authorized_keys content: cat ~/.ssh/authorized_keys"
echo "  - Check SSH logs: journalctl -u sshd -f"
echo "  - Test SSH config: sshd -t"
echo
echo "If you get locked out:"
echo "  - Use VPS provider's console access"
echo "  - Password authentication should still work as backup"
echo
echo "======================================================================"
echo "AUTOMATED TEST COMMANDS:"
echo "======================================================================"
echo
echo "After manual setup, run these commands to test:"
echo

cat << 'TESTEOF'
# Test SSH key authentication
echo "Testing SSH key authentication..."
ssh -i ~/.ssh/phantasia_server -o StrictHostKeyChecking=no root@212.227.85.148 "echo 'SSH Key Auth: SUCCESS - $(date)'"

# Test password authentication (will prompt for password)
echo "Testing password authentication..."
ssh -o StrictHostKeyChecking=no -o PubkeyAuthentication=no root@212.227.85.148 "echo 'Password Auth: SUCCESS - $(date)'"
TESTEOF

echo
echo "Copy and run the above commands after completing the manual setup."
echo "======================================================================"