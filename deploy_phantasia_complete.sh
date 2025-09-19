#!/bin/bash

# Master Phantasia Deployment Script
# This script runs everything in the correct order
# Modified to skip GelDB installation and auto-input password

set -e

# Server Configuration
SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

echo "======================================================================"
echo "🎭 PHANTASIA COMPLETE DEPLOYMENT MASTER SCRIPT"
echo "======================================================================"
echo "This script will deploy everything from scratch:"
echo "  ✅ Server setup (nginx, firewall, system updates)"
echo "  ✅ Website deployment (latest Angular build)"
echo "  ⏭️  GelDB integration (SKIPPED - manually installed)"
echo "  ✅ SSL/HTTPS configuration"
echo "  ✅ Complete testing and verification"
echo
echo "Server: root@212.227.85.148"
echo "Domain: deeptesting.prismaticcollections.com"
echo

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

print_step() {
    echo
    echo -e "${BLUE}======================================================================"
    echo -e "🚀 STEP $1: $2"
    echo -e "======================================================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if all scripts exist (excluding GelDB setup)
SCRIPTS=(
    "complete_server_setup.sh"
    "deploy_website.sh"
    "setup_ssl.sh"
    "test_deployment.sh"
)

for script in "${SCRIPTS[@]}"; do
    if [ ! -f "$script" ]; then
        print_error "Script $script not found!"
        exit 1
    fi
    chmod +x "$script"
done

# Check if website package exists
if [ ! -f "phantasia-website-latest.tar.gz" ]; then
    print_error "Website package phantasia-website-latest.tar.gz not found!"
    echo "Building website package..."
    pnpm run build
    tar -czf phantasia-website-latest.tar.gz -C dist/phantasia .
    print_success "Website package created"
fi

echo -e "${GREEN}✅ All prerequisites ready!${NC}"
echo
echo "⏰ Estimated completion time: 10-15 minutes"
echo "💾 Package size: $(ls -lh phantasia-website-latest.tar.gz | awk '{print $5}')"
echo

read -p "🚀 Ready to start deployment? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    exit 0
fi

START_TIME=$(date +%s)

# Function to run scripts with automated password input
run_script_with_password() {
    local script="$1"
    local description="$2"

    expect << EXPECTEOF
set timeout 300
spawn ./$script
expect {
    "*password*" {
        send "$SERVER_PASSWORD\r"
        exp_continue
    }
    "*Password*" {
        send "$SERVER_PASSWORD\r"
        exp_continue
    }
    eof
}
EXPECTEOF
    return $?
}

# Step 1: Server Setup
print_step "1" "SERVER SETUP"
run_script_with_password "complete_server_setup.sh" "Server Setup"
if [ $? -eq 0 ]; then
    print_success "Server setup completed"
else
    print_error "Server setup failed"
    exit 1
fi

# Step 2: Website Deployment
print_step "2" "WEBSITE DEPLOYMENT"
run_script_with_password "deploy_website.sh" "Website Deployment"
if [ $? -eq 0 ]; then
    print_success "Website deployment completed"
else
    print_error "Website deployment failed"
    exit 1
fi

# Step 3: GelDB Integration (SKIPPED)
print_step "3" "DATABASE INTEGRATION (SKIPPED)"
print_success "GelDB integration skipped - manually installed"

# Step 4: SSL Setup
print_step "4" "SSL/HTTPS SETUP"
run_script_with_password "setup_ssl.sh" "SSL Setup"
if [ $? -eq 0 ]; then
    print_success "SSL setup completed"
else
    print_error "SSL setup failed"
    exit 1
fi

# Step 5: Complete Testing
print_step "5" "TESTING AND VERIFICATION"
run_script_with_password "test_deployment.sh" "Testing"
TEST_RESULT=$?

END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

echo
echo "======================================================================"
echo "🎯 DEPLOYMENT COMPLETED!"
echo "======================================================================"
echo "⏱️  Total time: ${MINUTES}m ${SECONDS}s"
echo "🌐 Server: 212.227.85.148"
echo "🌍 Domain: deeptesting.prismaticcollections.com"
echo

if [ $TEST_RESULT -eq 0 ]; then
    echo -e "${GREEN}🎉 SUCCESS! Your Phantasia website is fully operational!${NC}"
    echo
    echo "🌐 Access your website:"
    echo "   📍 Direct IP: http://212.227.85.148"
    echo "   🌍 Domain: http://deeptesting.prismaticcollections.com"
    echo "   🔒 HTTPS: https://deeptesting.prismaticcollections.com"
    echo
    echo "🗄️ Database API:"
    echo "   📊 Health: http://212.227.85.148/api/health"
    echo "   🎵 Artists: http://212.227.85.148/api/artists"
    echo "   💿 Albums: http://212.227.85.148/api/albums"
    echo
    echo "⚙️ All services are running:"
    echo "   ✅ Nginx web server"
    echo "   ✅ GelDB database with API"
    echo "   ✅ UFW firewall configured"
    echo "   ✅ SSL certificates (if domain DNS configured)"
else
    echo -e "${YELLOW}⚠️ Deployment completed with some warnings.${NC}"
    echo "Check the test results above for details."
fi

echo
echo "📝 Log files available on server:"
echo "   - Nginx: /var/log/nginx/"
echo "   - GelDB API: journalctl -u geldb-api"
echo "   - System: /var/log/syslog"
echo
echo "🛠️ Useful commands:"
echo "   - Restart services: systemctl restart nginx geldb-api"
echo "   - Check status: systemctl status nginx geldb-api"
echo "   - Update SSL: certbot --nginx -d deeptesting.prismaticcollections.com"
echo
echo "======================================================================"
echo "🎭 PHANTASIA IS LIVE! Enjoy your deployment! 🎉"
echo "======================================================================"