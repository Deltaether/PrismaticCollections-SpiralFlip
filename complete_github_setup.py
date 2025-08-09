#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22
GITHUB_TOKEN = "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"
REPO_URL = "https://github.com/Deltaether/PrismaticCollections-SpiralFlip.git"

def complete_github_setup():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to remote server")
        
        def cmd(command, desc=""):
            if desc:
                print(f"\n🔧 {desc}")
            print(f"$ {command}")
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error and "warning" not in error.lower() and "already exists" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        # Update the deployment script with correct repository URL
        deployment_script = f'''#!/bin/bash

# Phantasia GitHub Deployment Script
set -e

REPO_URL="https://x-access-token:{GITHUB_TOKEN}@github.com/Deltaether/PrismaticCollections-SpiralFlip.git"
REPO_DIR="/root/phantasia-repo"
WEB_DIR="/var/www/phantasia"

echo "🚀 Starting GitHub deployment for Phantasia..."

# Clone or update repository
if [ ! -d "$REPO_DIR" ]; then
    echo "📥 Cloning repository from GitHub..."
    git clone "$REPO_URL" "$REPO_DIR"
    echo "✅ Repository cloned successfully!"
else
    echo "📥 Updating repository..."
    cd "$REPO_DIR"
    git fetch --all
    git reset --hard origin/alternative-backgroundplane
    git pull origin alternative-backgroundplane
    echo "✅ Repository updated successfully!"
fi

cd "$REPO_DIR"

# Check if Node.js is installed, install if not
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
fi

# Check if pnpm is installed, install if not  
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "📦 Installing dependencies..."
pnpm install

echo "🏗️  Building Angular application..."
pnpm run build

# Deploy to web directory
echo "🚀 Deploying to web directory..."
# Backup current version first
if [ -d "$WEB_DIR" ] && [ "$(ls -A $WEB_DIR)" ]; then
    cp -r "$WEB_DIR" "$WEB_DIR-backup-$(date +%Y%m%d-%H%M%S)"
    echo "✅ Current version backed up"
fi

# Clear and deploy new version
rm -rf "$WEB_DIR"/*
cp -r dist/phantasia/* "$WEB_DIR/"
chown -R www-data:www-data "$WEB_DIR"
chmod -R 755 "$WEB_DIR"

echo "🧪 Testing deployment..."
# Test that the website loads
if curl -s http://localhost/ | grep -q "phantasia\\|login\\|angular"; then
    echo "✅ Website deployment successful!"
    echo "🌐 Phantasia is now live at: http://212.227.85.148/"
    echo "🔐 Authentication: phantasia_dev / i1Si1SbOEkgK"
else
    echo "⚠️  Website deployed but may have issues. Check manually."
fi

echo "📊 Deployment Summary:"
echo "  📁 Repository: $REPO_URL"
echo "  📂 Local repo: $REPO_DIR" 
echo "  🌐 Web root: $WEB_DIR"
echo "  🔐 Authentication: Angular-based"
echo "  ✅ Status: Deployment completed!"
'''
        
        # Write updated deployment script
        stdin, stdout, stderr = ssh.exec_command(f"cat > /root/deploy_from_github.sh << 'EOF'\n{deployment_script}\nEOF")
        stdout.channel.recv_exit_status()
        print("✅ Updated deployment script with correct repository URL")
        
        # Make sure it's executable
        cmd("chmod +x /root/deploy_from_github.sh", "Making deployment script executable")
        
        # Create a quick deployment alias
        cmd("echo 'alias deploy-phantasia=\"/root/deploy_from_github.sh\"' >> /root/.bashrc", "Creating deployment alias")
        
        # Test that we can access the repository (but don't clone yet until repo is created)
        print("\n🧪 Testing GitHub access...")
        test_result = cmd("curl -s -H 'Authorization: token " + GITHUB_TOKEN + "' https://api.github.com/repos/Deltaether/PrismaticCollections-SpiralFlip")
        
        if not test_result:
            print("⚠️  Repository not found on GitHub yet - will be created manually")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def print_final_instructions():
    print(f"""
🎉 GITHUB DEPLOYMENT SETUP COMPLETE!

📋 NEXT STEPS:

1. 🆕 Create the GitHub Repository:
   - Go to: https://github.com/new
   - Repository name: PrismaticCollections-SpiralFlip
   - Description: Phantasia 3D Interactive Website with Angular Authentication
   - ✅ Make it Public (or Private if preferred)
   - ❌ Don't initialize with README (we have existing code)

2. 🚀 Push Local Code to GitHub:
   git push -u origin alternative-backgroundplane

3. 🖥️  Deploy to Server:
   SSH to server and run: /root/deploy_from_github.sh
   OR use alias: deploy-phantasia

4. 🔄 Future Updates:
   - Make changes locally
   - git add . && git commit -m "Your changes"
   - git push
   - SSH to server: deploy-phantasia

🔐 AUTHENTICATION INFO:
   URL: http://212.227.85.148/
   Username: phantasia_dev
   Password: i1Si1SbOEkgK

📁 SERVER PATHS:
   Repository: /root/phantasia-repo
   Website: /var/www/phantasia
   Deploy Script: /root/deploy_from_github.sh

🌐 After setup, your workflow will be:
   Local Changes → Git Push → Server Deploy → Live Website!
""")

if __name__ == "__main__":
    print("🔧 Completing GitHub Deployment Setup")
    print("=" * 50)
    
    if complete_github_setup():
        print_final_instructions()
    else:
        print("❌ GitHub setup failed")