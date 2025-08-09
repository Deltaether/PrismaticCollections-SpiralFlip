#!/bin/bash

# Deployment script using expect for password automation
SERVER_IP="212.227.85.148"
USERNAME="root"
PASSWORD="16nFuBcg"

echo "🚀 Deploying Project Phantasia with expect..."

# Install expect if not present
if ! command -v expect &> /dev/null; then
    echo "📦 expect not found. Using manual method..."
    echo "Please run these commands manually:"
    echo ""
    echo "1. Upload deployment package:"
    echo "   scp -P 22 phantasia-deploy.tar.gz root@212.227.85.148:~/"
    echo "   Password: ${PASSWORD}"
    echo ""
    echo "2. Connect to server:"
    echo "   ssh -p 22 root@212.227.85.148"
    echo "   Password: ${PASSWORD}"
    echo ""
    echo "3. Run on server:"
    echo "   mkdir -p /root/Projects/ProjectPhantasia"
    echo "   cd /root/Projects/ProjectPhantasia"
    echo "   tar -xzf ~/phantasia-deploy.tar.gz"
    echo "   # ... (nginx configuration)"
    exit 1
fi

# Create expect script for upload
cat > upload.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 60
set server_ip [lindex $argv 0]
set username [lindex $argv 1] 
set password [lindex $argv 2]

spawn scp -P 22 phantasia-deploy.tar.gz $username@$server_ip:~/
expect {
    "password:" { send "$password\r"; exp_continue }
    "Password:" { send "$password\r"; exp_continue }
    "(yes/no)?" { send "yes\r"; exp_continue }
    eof { puts "Upload completed" }
    timeout { puts "Upload timed out"; exit 1 }
}
EOF

# Create expect script for SSH execution
cat > deploy.exp << 'EOF'
#!/usr/bin/expect -f
set timeout 120
set server_ip [lindex $argv 0]
set username [lindex $argv 1]
set password [lindex $argv 2]

spawn ssh -p 22 $username@$server_ip
expect {
    "password:" { send "$password\r"; exp_continue }
    "Password:" { send "$password\r"; exp_continue }
    "(yes/no)?" { send "yes\r"; exp_continue }
    "# " {
        # Connected successfully, run deployment commands
        send "echo 'Starting deployment...'\r"
        expect "# "
        
        send "apt update && apt install -y nginx\r"
        expect "# " { puts "nginx installed" }
        
        send "mkdir -p /root/Projects/ProjectPhantasia\r"
        expect "# "
        
        send "cd /root/Projects/ProjectPhantasia\r"
        expect "# "
        
        send "tar -xzf ~/phantasia-deploy.tar.gz\r"
        expect "# "
        
        send "ls -la\r"
        expect "# "
        
        # Configure nginx
        send "cat > /etc/nginx/sites-available/phantasia << 'NGINXEOF'\nserver {\n    listen 80;\n    server_name _;\n    root /root/Projects/ProjectPhantasia;\n    index index.html;\n    \n    location / {\n        try_files \$uri \$uri/ /index.html;\n    }\n    \n    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)\$ {\n        expires 1y;\n        add_header Cache-Control \"public, immutable\";\n        try_files \$uri =404;\n    }\n}\nNGINXEOF\r"
        expect "# "
        
        send "ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/\r"
        expect "# "
        
        send "rm -f /etc/nginx/sites-enabled/default\r"
        expect "# "
        
        send "nginx -t\r"
        expect "# "
        
        send "systemctl restart nginx\r"
        expect "# "
        
        send "systemctl enable nginx\r"
        expect "# "
        
        send "curl -I http://localhost/\r"
        expect "# "
        
        send "echo 'Deployment completed successfully!'\r"
        expect "# "
        
        send "exit\r"
        expect eof
    }
    timeout { puts "Connection timed out"; exit 1 }
}
EOF

chmod +x upload.exp deploy.exp

echo "📤 Uploading files..."
./upload.exp "${SERVER_IP}" "${USERNAME}" "${PASSWORD}"

echo "🔧 Deploying on server..."
./deploy.exp "${SERVER_IP}" "${USERNAME}" "${PASSWORD}"

# Cleanup
rm -f upload.exp deploy.exp

echo "🎉 Deployment completed!"
echo "Testing website..."

if curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}/ | grep -q "200"; then
    echo "✅ Website is live at http://${SERVER_IP}/"
else
    echo "❌ Website test failed"
fi