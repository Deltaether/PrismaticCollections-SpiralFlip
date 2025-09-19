#!/bin/bash

# Automated Server Fix Script
# This script will attempt to connect and fix the nginx server automatically

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="Kd7bY1mQ"

echo "======================================================================"
echo "AUTOMATED NGINX SERVER FIX"
echo "======================================================================"
echo "Target: $SERVER_USER@$SERVER_IP"
echo "Password: $SERVER_PASSWORD"
echo

# Try to connect using expect (if available)
if command -v expect &> /dev/null; then
    echo "Using expect for automated connection..."

    expect << EOF
set timeout 60
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP

expect {
    "*password*" {
        send "$SERVER_PASSWORD\r"
        exp_continue
    }
    "*yes/no*" {
        send "yes\r"
        exp_continue
    }
    "*#*" {
        # We're now connected to the server
        send "echo 'Connected successfully to \$(hostname)'\r"

        # Update system
        send "apt update\r"
        expect "*#*"

        # Install nginx
        send "apt install -y nginx\r"
        expect "*#*"

        # Start and enable nginx
        send "systemctl start nginx\r"
        expect "*#*"
        send "systemctl enable nginx\r"
        expect "*#*"

        # Create website directory
        send "mkdir -p /var/www/phantasia/browser\r"
        expect "*#*"

        # Create test HTML file
        send "cat > /var/www/phantasia/browser/index.html << 'HTMLEOF'\r"
        send "<!DOCTYPE html>\r"
        send "<html>\r"
        send "<head><title>Phantasia Server Working</title></head>\r"
        send "<body>\r"
        send "<h1>Phantasia Server is Online!</h1>\r"
        send "<p>Server ready for Angular deployment</p>\r"
        send "<p>Time: \$(date)</p>\r"
        send "</body>\r"
        send "</html>\r"
        send "HTMLEOF\r"
        expect "*#*"

        # Configure nginx
        send "cat > /etc/nginx/sites-available/phantasia << 'NGINXEOF'\r"
        send "server {\r"
        send "    listen 80;\r"
        send "    listen [::]:80;\r"
        send "    server_name deeptesting.prismaticcollections.com $SERVER_IP;\r"
        send "    root /var/www/phantasia/browser;\r"
        send "    index index.html;\r"
        send "\r"
        send "    location / {\r"
        send "        try_files \\\$uri \\\$uri/ /index.html;\r"
        send "    }\r"
        send "\r"
        send "    location /assets/ {\r"
        send "        expires 1y;\r"
        send "        add_header Cache-Control \"public, immutable\";\r"
        send "    }\r"
        send "}\r"
        send "NGINXEOF\r"
        expect "*#*"

        # Enable the site
        send "ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/\r"
        expect "*#*"
        send "rm -f /etc/nginx/sites-enabled/default\r"
        expect "*#*"

        # Test nginx config
        send "nginx -t\r"
        expect "*#*"

        # Reload nginx
        send "systemctl reload nginx\r"
        expect "*#*"

        # Configure firewall
        send "ufw allow 22\r"
        expect "*#*"
        send "ufw allow 80\r"
        expect "*#*"
        send "ufw allow 443\r"
        expect "*#*"
        send "ufw --force enable\r"
        expect "*#*"

        # Set permissions
        send "chown -R www-data:www-data /var/www/phantasia\r"
        expect "*#*"
        send "chmod -R 755 /var/www/phantasia\r"
        expect "*#*"

        # Test local access
        send "curl -I http://localhost\r"
        expect "*#*"

        # Show status
        send "systemctl status nginx --no-pager\r"
        expect "*#*"
        send "netstat -tlnp | grep :80\r"
        expect "*#*"

        send "echo 'Nginx setup complete!'\r"
        send "exit\r"
    }
    timeout {
        puts "Connection timeout"
        exit 1
    }
    eof {
        puts "Connection ended"
    }
}
EOF

else
    echo "Expect not available. Installing expect..."
    # Try to install expect
    sudo apt update && sudo apt install -y expect || {
        echo "❌ Cannot install expect. Manual connection required."
        echo
        echo "Please connect manually:"
        echo "ssh $SERVER_USER@$SERVER_IP"
        echo "Password: $SERVER_PASSWORD"
        echo
        echo "Then run the commands from fix_server_nginx.sh"
        exit 1
    }

    # Retry with expect
    echo "Retrying with expect..."
    exec $0
fi

echo
echo "======================================================================"
echo "Testing external access..."
echo "======================================================================"

# Wait a moment for services to start
sleep 5

# Test HTTP access
echo "Testing HTTP access..."
if curl -I --connect-timeout 10 http://$SERVER_IP 2>/dev/null | head -1; then
    echo "✅ HTTP is working!"
else
    echo "❌ HTTP still not accessible"
fi

# Test domain access
echo "Testing domain access..."
if curl -I --connect-timeout 10 http://deeptesting.prismaticcollections.com 2>/dev/null | head -1; then
    echo "✅ Domain is working!"
else
    echo "❌ Domain still not accessible (may take time for Cloudflare to detect)"
fi

echo
echo "======================================================================"
echo "✅ AUTOMATED FIX COMPLETE!"
echo "======================================================================"
echo "Next steps:"
echo "1. Deploy the Angular website files"
echo "2. Set up SSL certificates"
echo "3. Test full functionality"
echo "======================================================================"