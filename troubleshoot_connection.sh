#!/bin/bash

# Server Connection Troubleshooting Script

SERVER_IP="212.227.85.148"
SERVER_PORT="22"

echo "🔍 Troubleshooting server connection..."
echo "Server: ${SERVER_IP}:${SERVER_PORT}"
echo ""

# Test 1: Ping test
echo "1️⃣  Testing server reachability..."
if ping -c 3 -W 3 "${SERVER_IP}" > /dev/null 2>&1; then
    echo "✅ Server is reachable via ping"
else
    echo "❌ Server is not reachable via ping"
fi
echo ""

# Test 2: Port connectivity
echo "2️⃣  Testing SSH port connectivity..."
if timeout 10 bash -c "</dev/tcp/${SERVER_IP}/${SERVER_PORT}" 2>/dev/null; then
    echo "✅ Port ${SERVER_PORT} is open"
else
    echo "❌ Port ${SERVER_PORT} is closed or unreachable"
fi
echo ""

# Test 3: Try common SSH ports
echo "3️⃣  Testing common SSH ports..."
for port in 22 2022 2222 443 80; do
    echo -n "   Testing port ${port}... "
    if timeout 5 bash -c "</dev/tcp/${SERVER_IP}/${port}" 2>/dev/null; then
        echo "✅ OPEN"
    else
        echo "❌ closed"
    fi
done
echo ""

# Test 4: Try different usernames
echo "4️⃣  Possible troubleshooting steps:"
echo "   a) Check if the server/VPS is powered on"
echo "   b) Verify the IP address is correct: ${SERVER_IP}"
echo "   c) Check if SSH service is running on the server"
echo "   d) Try different usernames: root, ubuntu, admin, user"
echo "   e) Check if firewall is blocking connections"
echo ""

echo "5️⃣  Manual connection attempts:"
echo "   ssh -p 22 root@${SERVER_IP}"
echo "   ssh -p 22 ubuntu@${SERVER_IP}"  
echo "   ssh -p 22 admin@${SERVER_IP}"
echo ""
echo "   Password: voan6B86"
echo ""

echo "🚀 All deployment files are ready:"
ls -la phantasia-deploy.tar.gz server_setup.sh complete_deployment.sh 2>/dev/null
echo ""
echo "Once server is accessible, run: ./complete_deployment.sh"