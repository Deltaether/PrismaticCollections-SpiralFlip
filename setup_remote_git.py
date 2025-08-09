#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22
GITHUB_TOKEN = "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"

def setup_remote_git():
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

        # Install git if not present
        cmd("apt update && apt install -y git", "Installing git")
        
        # Configure git globally
        cmd("git config --global user.name 'Phantasia Server'", "Setting git username")
        cmd("git config --global user.email 'server@phantasia.dev'", "Setting git email")
        cmd("git config --global init.defaultBranch main", "Setting default branch")
        
        # Check git version
        cmd("git --version", "Checking git installation")
        
        # Create directory for the repository
        cmd("mkdir -p /root/phantasia-repo", "Creating repository directory")
        
        # Set up GitHub token authentication
        print("\n🔑 Setting up GitHub authentication...")
        
        # Method 1: Using git credential helper with token
        cmd("git config --global credential.helper store", "Setting up credential helper")
        
        # Create credentials file with token
        credentials_content = f"https://x-access-token:{GITHUB_TOKEN}@github.com"
        stdin, stdout, stderr = ssh.exec_command(f"echo '{credentials_content}' > /root/.git-credentials")
        stdout.channel.recv_exit_status()
        print("✅ GitHub credentials configured")
        
        # Test GitHub connectivity
        cmd("curl -H 'Authorization: token " + GITHUB_TOKEN + "' https://api.github.com/user", "Testing GitHub API access")
        
        # Create deployment script
        deployment_script = f'''#!/bin/bash

# Phantasia GitHub Deployment Script
set -e

REPO_URL="https://x-access-token:{GITHUB_TOKEN}@github.com/USER/REPO.git"
REPO_DIR="/root/phantasia-repo"
WEB_DIR="/var/www/phantasia"

echo "🚀 Starting GitHub deployment..."

# Clone or update repository
if [ ! -d "$REPO_DIR" ]; then
    echo "📥 Cloning repository..."
    git clone "$REPO_URL" "$REPO_DIR"
else
    echo "📥 Updating repository..."
    cd "$REPO_DIR"
    git pull origin main
fi

cd "$REPO_DIR"

# Install dependencies and build
echo "📦 Installing dependencies..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g pnpm

echo "🏗️  Building application..."
pnpm install
pnpm run build

# Deploy to web directory
echo "🚀 Deploying to web directory..."
rm -rf "$WEB_DIR"/*
cp -r dist/phantasia/* "$WEB_DIR/"
chown -R www-data:www-data "$WEB_DIR"
chmod -R 755 "$WEB_DIR"

echo "✅ Deployment completed successfully!"
echo "🌐 Website available at: http://212.227.85.148/"

# Test deployment
curl -I http://localhost/ || echo "⚠️ Website test failed"
'''
        
        # Write deployment script
        stdin, stdout, stderr = ssh.exec_command(f"cat > /root/deploy_from_github.sh << 'EOF'\n{deployment_script}\nEOF")
        stdout.channel.recv_exit_status()
        
        cmd("chmod +x /root/deploy_from_github.sh", "Making deployment script executable")
        
        print("✅ GitHub deployment script created at /root/deploy_from_github.sh")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def create_github_instructions():
    print(f"""
🐙 GITHUB SETUP INSTRUCTIONS:

1. 📝 Create GitHub Repository:
   - Go to https://github.com/new
   - Repository name: PrismaticCollections-SpiralFlip
   - Description: Phantasia 3D Interactive Website with Angular Authentication
   - Set to Public or Private as preferred
   - Initialize with README: No (we have existing code)

2. 🔗 Update Local Repository:
   Replace USER with your GitHub username:
   
   git remote remove origin
   git remote add origin https://github.com/USER/PrismaticCollections-SpiralFlip.git
   git push -u origin alternative-backgroundplane

3. 🚀 Deploy from GitHub on Server:
   Update /root/deploy_from_github.sh with correct repo URL
   Run: /root/deploy_from_github.sh

4. ⚡ Automated Updates:
   - Make changes locally
   - git commit -m "Update message" 
   - git push
   - SSH to server: /root/deploy_from_github.sh

🔑 GitHub Token: {GITHUB_TOKEN[:20]}...
🌐 Server: http://212.227.85.148/
""")

if __name__ == "__main__":
    print("🔧 Setting up Git on Remote Server")
    print("=" * 50)
    
    if setup_remote_git():
        create_github_instructions()
        print("\n✅ Remote git setup completed!")
    else:
        print("❌ Remote git setup failed")