# Phantasia Project - Manual Deployment Guide

## Overview
This guide provides step-by-step instructions for manually deploying the Phantasia project to the server at 212.227.85.148 with domain deeptesting.prismaticcollections.com.

## Prerequisites
- Server: root@212.227.85.148
- Password: Kd7bY1mQ
- Domain: deeptesting.prismaticcollections.com
- Local files ready: phantasia-website.tar.gz (670M), twitter-python-fetcher.tar.gz (33M)

## Step 1: File Transfer

### Method 1: Using SCP (if sshpass available)
```bash
# Transfer website files
scp phantasia-website.tar.gz root@212.227.85.148:~/

# Transfer Twitter fetcher
scp twitter-python-fetcher.tar.gz root@212.227.85.148:~/
```

### Method 2: Using Croc (Recommended)
```bash
# On local machine - Send website
croc send phantasia-website.tar.gz

# On server - Receive (use the code provided by croc)
croc [code-from-sender]

# Repeat for Twitter fetcher
croc send twitter-python-fetcher.tar.gz
# On server: croc [code-from-sender]
```

### Method 3: Manual Upload via Web Interface
If other methods fail, you can use a web upload service or set up a temporary HTTP server.

## Step 2: Server Setup Commands

### Connect to Server
```bash
ssh root@212.227.85.148
# Enter password: Kd7bY1mQ
```

### Update System and Install Dependencies
```bash
# Update system
apt update && apt upgrade -y

# Install basic tools
apt install -y curl wget unzip nginx python3 python3-pip python3-venv git

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs

# Install croc for future transfers
curl -sSL https://getcroc.schollz.com | bash

# Verify installations
node --version
python3 --version
nginx -v
```

### Set Up Angular Website
```bash
# Create web directory
mkdir -p /var/www/phantasia

# Extract website files
cd /var/www/phantasia
tar -xzf ~/phantasia-website.tar.gz --strip-components=1

# Set proper permissions
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Verify extraction
ls -la /var/www/phantasia
```

### Set Up Twitter Python Fetcher
```bash
# Create app directory
mkdir -p /opt/phantasia

# Extract Twitter fetcher
cd /opt/phantasia
tar -xzf ~/twitter-python-fetcher.tar.gz

# Set up Python virtual environment
cd /opt/phantasia/twitter-feedback-python
python3 -m venv venv

# Activate and install dependencies
source venv/bin/activate
pip install -r requirements.txt

# Verify setup
python --version
pip list
```

### Install GelDB Client
```bash
# Install GelDB
curl https://www.geldata.com/sh --proto "=https" -sSf1 | sh

# Reload shell configuration
source ~/.bashrc

# Verify installation
geldb --version
```

## Step 3: Nginx Configuration

### Install SSL Tools
```bash
# Install certbot for SSL
apt install -y certbot python3-certbot-nginx
```

### Create Nginx Configuration
```bash
# Create site configuration
cat > /etc/nginx/sites-available/deeptesting.prismaticcollections.com << 'EOF'
server {
    listen 80;
    server_name deeptesting.prismaticcollections.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name deeptesting.prismaticcollections.com;

    root /var/www/phantasia;
    index index.html;

    # SSL Configuration (will be updated by certbot)
    ssl_certificate /etc/letsencrypt/live/deeptesting.prismaticcollections.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/deeptesting.prismaticcollections.com/privkey.pem;

    # Angular routing support
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # GelDB API proxy
    location /api/ {
        proxy_pass http://localhost:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
}
EOF

# Enable the site
ln -sf /etc/nginx/sites-available/deeptesting.prismaticcollections.com /etc/nginx/sites-enabled/

# Remove default site
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Start nginx
systemctl enable nginx
systemctl restart nginx
```

## Step 4: SSL Certificate Setup

### Get Let's Encrypt Certificate
```bash
# Get SSL certificate (replace email with your email)
certbot --nginx -d deeptesting.prismaticcollections.com --non-interactive --agree-tos --email admin@deeptesting.prismaticcollections.com

# Enable auto-renewal
systemctl enable certbot.timer

# Test renewal
certbot renew --dry-run
```

## Step 5: GelDB Configuration

### Connect GelDB to Website
```bash
# Start GelDB service (example command - adjust based on your data)
cd /opt/phantasia/twitter-feedback-python

# Configure GelDB connection
geldb init

# Import your data if needed
# geldb import your-data-file.json

# Start GelDB server on port 8080
geldb serve --port 8080 &

# Make it persistent
nohup geldb serve --port 8080 > /var/log/geldb.log 2>&1 &
```

### Create Systemd Service for GelDB
```bash
cat > /etc/systemd/system/geldb.service << 'EOF'
[Unit]
Description=GelDB Server
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia/twitter-feedback-python
ExecStart=/root/.local/bin/geldb serve --port 8080
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl enable geldb
systemctl start geldb
systemctl status geldb
```

## Step 6: Verification and Testing

### Test Basic Connectivity
```bash
# Test HTTP redirect
curl -I http://deeptesting.prismaticcollections.com

# Test HTTPS access
curl -I https://deeptesting.prismaticcollections.com

# Test website content
curl https://deeptesting.prismaticcollections.com

# Check nginx status
systemctl status nginx

# Check nginx error logs if needed
tail -f /var/log/nginx/error.log
```

### Test GelDB Integration
```bash
# Test GelDB directly
curl http://localhost:8080/

# Test through nginx proxy
curl https://deeptesting.prismaticcollections.com/api/

# Check GelDB logs
tail -f /var/log/geldb.log
```

### Test SSL Certificate
```bash
# Check certificate details
openssl s_client -connect deeptesting.prismaticcollections.com:443 -servername deeptesting.prismaticcollections.com

# Test SSL rating (online)
# Visit: https://www.ssllabs.com/ssltest/analyze.html?d=deeptesting.prismaticcollections.com
```

## Step 7: Twitter Fetcher Setup

### Configure Twitter API
```bash
cd /opt/phantasia/twitter-feedback-python

# Set up environment variables (replace with your actual tokens)
cat > .env << 'EOF'
TWITTER_BEARER_TOKEN=your_bearer_token_here
GELDB_URL=http://localhost:8080
EOF

# Test Twitter fetcher
source venv/bin/activate
python simple_fetcher.py
```

### Create Systemd Service for Twitter Fetcher
```bash
cat > /etc/systemd/system/twitter-fetcher.service << 'EOF'
[Unit]
Description=Twitter Data Fetcher
After=network.target geldb.service

[Service]
Type=simple
User=root
WorkingDirectory=/opt/phantasia/twitter-feedback-python
Environment=PATH=/opt/phantasia/twitter-feedback-python/venv/bin
ExecStart=/opt/phantasia/twitter-feedback-python/venv/bin/python simple_fetcher.py
Restart=always
RestartSec=300

[Install]
WantedBy=multi-user.target
EOF

# Enable and start the service
systemctl enable twitter-fetcher
systemctl start twitter-fetcher
systemctl status twitter-fetcher
```

## Step 8: Final Security and Optimization

### Firewall Configuration
```bash
# Install and configure UFW
apt install -y ufw

# Allow SSH, HTTP, and HTTPS
ufw allow ssh
ufw allow 80
ufw allow 443

# Enable firewall
ufw --force enable

# Check status
ufw status
```

### Performance Optimization
```bash
# Enable gzip compression in nginx
cat >> /etc/nginx/nginx.conf << 'EOF'
    # Gzip Settings
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private no_last_modified no_etag auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/json
        application/javascript
        application/xml+rss
        application/atom+xml
        image/svg+xml;
EOF

# Restart nginx
systemctl restart nginx
```

## Troubleshooting

### Common Issues and Solutions

1. **Nginx 500 Error**
   ```bash
   # Check nginx error logs
   tail -f /var/log/nginx/error.log

   # Check file permissions
   ls -la /var/www/phantasia
   ```

2. **SSL Certificate Issues**
   ```bash
   # Renew certificate manually
   certbot renew

   # Check certificate status
   certbot certificates
   ```

3. **GelDB Connection Issues**
   ```bash
   # Check if GelDB is running
   systemctl status geldb

   # Check port availability
   netstat -tlnp | grep :8080
   ```

4. **Twitter Fetcher Issues**
   ```bash
   # Check service logs
   journalctl -u twitter-fetcher -f

   # Test manually
   cd /opt/phantasia/twitter-feedback-python
   source venv/bin/activate
   python simple_fetcher.py
   ```

## Final Verification Checklist

- [ ] Website accessible via HTTPS: https://deeptesting.prismaticcollections.com
- [ ] HTTP redirects to HTTPS properly
- [ ] SSL certificate is valid and trusted
- [ ] Angular routing works (refresh on any page should work)
- [ ] GelDB API accessible via /api/ endpoint
- [ ] Twitter fetcher running and collecting data
- [ ] All services start automatically on boot
- [ ] Firewall properly configured
- [ ] Nginx compression enabled
- [ ] Error logs are clean

## Post-Deployment

### Regular Maintenance
```bash
# Check system updates
apt update && apt list --upgradable

# Check service status
systemctl status nginx geldb twitter-fetcher

# Check disk space
df -h

# Check memory usage
free -h

# Check logs for errors
journalctl --since "1 hour ago" --priority=err
```

### Backup Procedures
```bash
# Backup website files
tar -czf /root/backup-website-$(date +%Y%m%d).tar.gz /var/www/phantasia

# Backup GelDB data (adjust path as needed)
tar -czf /root/backup-geldb-$(date +%Y%m%d).tar.gz /opt/phantasia

# Backup nginx configuration
tar -czf /root/backup-nginx-$(date +%Y%m%d).tar.gz /etc/nginx
```

---

This comprehensive guide should enable successful manual deployment of the Phantasia project with all required components.