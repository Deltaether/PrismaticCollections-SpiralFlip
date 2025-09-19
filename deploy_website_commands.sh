#!/bin/bash

# Website Deployment Commands for Server
echo "======================================================================"
echo "PHANTASIA WEBSITE DEPLOYMENT"
echo "======================================================================"
echo "Run these commands on the server (root@212.227.85.148)"
echo

# Install croc if not available
echo "1. Install croc (if needed):"
echo "curl https://getcroc.schollz.com | bash"
echo

# Receive the file
echo "2. Receive the website files:"
echo "croc 0723-select-point-snow"
echo

# Deploy the website
cat << 'DEPLOYEOF'
# 3. Deploy the website files:

# Backup current website
echo "Backing up current website..."
if [ -d "/var/www/phantasia" ]; then
    mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)
fi

# Create new website directory
echo "Creating website directory..."
mkdir -p /var/www/phantasia

# Extract the website
echo "Extracting website files..."
tar -xzf ~/phantasia-website-updated.tar.gz -C /var/www/phantasia/

# Set permissions
echo "Setting permissions..."
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Restart nginx
echo "Restarting nginx..."
systemctl restart nginx

# Test the deployment
echo "Testing deployment..."
curl -I http://localhost

# Clean up
echo "Cleaning up..."
rm -f ~/phantasia-website-updated.tar.gz

echo "✅ Website deployment complete!"
echo "Visit: http://212.227.85.148"
echo "Domain: http://deeptesting.prismaticcollections.com"

DEPLOYEOF

echo
echo "======================================================================"
echo "AUTOMATED DEPLOYMENT SCRIPT"
echo "======================================================================"
echo "Copy and run this entire script on the server:"
echo

cat << 'AUTOEOF'
#!/bin/bash
echo "Starting automated deployment..."

# Install croc
curl https://getcroc.schollz.com | bash

# Receive file
echo "Receiving website files..."
croc 0723-select-point-snow

# Deploy
echo "Deploying website..."
if [ -d "/var/www/phantasia" ]; then
    mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)
fi

mkdir -p /var/www/phantasia
tar -xzf ~/phantasia-website-updated.tar.gz -C /var/www/phantasia/
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia
systemctl restart nginx

echo "Testing deployment..."
curl -I http://localhost
rm -f ~/phantasia-website-updated.tar.gz

echo "✅ Deployment complete!"
AUTOEOF