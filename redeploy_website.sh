#!/bin/bash

# Website Redeployment Script
echo "======================================================================"
echo "PHANTASIA WEBSITE REDEPLOYMENT"
echo "======================================================================"
echo "Server: root@212.227.85.148"
echo "Updated Package: phantasia-website-updated.tar.gz (670MB)"
echo "Latest Changes: Cleaned obsolete files, updated deployment scripts, UI improvements"
echo

SERVER="root@212.227.85.148"
WEBSITE_PACKAGE="phantasia-website-updated.tar.gz"

echo "1. Checking SSH connection..."
if ssh -i ~/.ssh/phantasia_server -o ConnectTimeout=10 -o StrictHostKeyChecking=no $SERVER "echo 'Connected successfully'"; then
    echo "✅ SSH connection working"
else
    echo "❌ SSH connection failed. Using manual instructions below."
    echo
    echo "MANUAL DEPLOYMENT INSTRUCTIONS:"
    echo "======================================================================"
    echo
    echo "1. Transfer the updated website package to server:"
    echo "   scp $WEBSITE_PACKAGE root@212.227.85.148:~/"
    echo
    echo "2. Connect to server and deploy:"
    echo "   ssh root@212.227.85.148"
    echo
    echo "3. On the server, run these commands:"
    echo "   # Backup current website"
    echo "   mv /var/www/phantasia /var/www/phantasia.backup.\$(date +%Y%m%d_%H%M%S)"
    echo
    echo "   # Create new website directory"
    echo "   mkdir -p /var/www/phantasia"
    echo
    echo "   # Extract updated website"
    echo "   tar -xzf ~/phantasia-website-updated.tar.gz -C /var/www/phantasia/"
    echo
    echo "   # Set correct permissions"
    echo "   chown -R www-data:www-data /var/www/phantasia"
    echo "   chmod -R 755 /var/www/phantasia"
    echo
    echo "   # Restart nginx"
    echo "   systemctl restart nginx"
    echo
    echo "   # Test deployment"
    echo "   curl -I https://deeptesting.prismaticcollections.com"
    echo
    echo "======================================================================"
    exit 1
fi

echo
echo "2. Transferring updated website package..."
if scp -i ~/.ssh/phantasia_server $WEBSITE_PACKAGE $SERVER:~/; then
    echo "✅ Website package transferred successfully"
else
    echo "❌ Failed to transfer website package"
    exit 1
fi

echo
echo "3. Deploying updated website on server..."
ssh -i ~/.ssh/phantasia_server $SERVER << 'EOF'
echo "=== Starting website redeployment ==="

# Backup current website
echo "Backing up current website..."
if [ -d "/var/www/phantasia" ]; then
    mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)
    echo "✅ Current website backed up"
fi

# Create new website directory
echo "Creating new website directory..."
mkdir -p /var/www/phantasia

# Extract updated website
echo "Extracting updated website..."
tar -xzf ~/phantasia-website-updated.tar.gz -C /var/www/phantasia/
echo "✅ Updated website extracted"

# Set correct permissions
echo "Setting correct permissions..."
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia
echo "✅ Permissions set"

# Check if nginx is running and restart it
echo "Restarting nginx..."
if systemctl is-active --quiet nginx; then
    systemctl restart nginx
    echo "✅ Nginx restarted"
else
    echo "⚠️ Nginx not running, starting it..."
    systemctl start nginx
fi

# Clean up
echo "Cleaning up deployment file..."
rm -f ~/phantasia-website-updated.tar.gz

echo "=== Deployment complete ==="
EOF

echo
echo "4. Testing deployment..."
echo "Checking HTTPS endpoint..."
if curl -I -s https://deeptesting.prismaticcollections.com | head -1; then
    echo "✅ Website is responding"
else
    echo "⚠️ Testing direct IP access..."
    curl -I -s http://212.227.85.148 | head -1
fi

echo
echo "======================================================================"
echo "✅ REDEPLOYMENT COMPLETE!"
echo "======================================================================"
echo "Website URL: https://deeptesting.prismaticcollections.com"
echo "Direct IP: http://212.227.85.148"
echo
echo "Recent changes deployed:"
echo "  - Cleaned obsolete JavaScript and CSS files"
echo "  - Updated deployment scripts and documentation"
echo "  - Enhanced home component layout and styling"
echo "  - Improved project maintainability"
echo
echo "Next steps:"
echo "  1. Test website functionality"
echo "  2. Verify GelDB integration"
echo "  3. Check Twitter data fetching"
echo "  4. Confirm all routes are working"
echo "======================================================================"