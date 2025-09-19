#!/bin/bash

# Quick File Transfer with Croc
echo "======================================================================"
echo "QUICK WEBSITE REDEPLOYMENT VIA CROC"
echo "======================================================================"
echo
echo "Updated website package ready: phantasia-website-updated.tar.gz (670MB)"
echo
echo "Latest changes include:"
echo "  ✅ Cleaned obsolete JavaScript and CSS files"
echo "  ✅ Updated deployment scripts and documentation"
echo "  ✅ Enhanced home component layout and styling"
echo "  ✅ Improved project maintainability"
echo
echo "OPTION 1: Transfer via Croc"
echo "======================================================================"
echo "1. Run this command to send the file:"
echo "   croc send phantasia-website-updated.tar.gz"
echo
echo "2. On the server, install and receive:"
echo "   # Install croc if not available"
echo "   curl https://getcroc.schollz.com | bash"
echo "   # Receive the file (use the code from sender)"
echo "   croc [CODE-FROM-SENDER]"
echo
echo "OPTION 2: Direct SCP Transfer (once SSH is set up)"
echo "======================================================================"
echo "   scp phantasia-website-updated.tar.gz root@212.227.85.148:~/"
echo
echo "DEPLOYMENT COMMANDS FOR SERVER:"
echo "======================================================================"
cat << 'EOF'
# Backup current website
mv /var/www/phantasia /var/www/phantasia.backup.$(date +%Y%m%d_%H%M%S)

# Create new website directory
mkdir -p /var/www/phantasia

# Extract updated website
tar -xzf ~/phantasia-website-updated.tar.gz -C /var/www/phantasia/

# Set correct permissions
chown -R www-data:www-data /var/www/phantasia
chmod -R 755 /var/www/phantasia

# Restart nginx
systemctl restart nginx

# Test deployment
curl -I https://deeptesting.prismaticcollections.com
curl -I http://localhost

# Clean up
rm -f ~/phantasia-website-updated.tar.gz

echo "✅ Redeployment complete!"
EOF
echo
echo "======================================================================"
echo "Ready to transfer! Choose your preferred method above."
echo "======================================================================"