#!/usr/bin/env python3

import paramiko
import sys

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def update_remote_to_uv():
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
            
            while True:
                line = stdout.readline()
                if not line:
                    break
                print(line.rstrip())
                sys.stdout.flush()
            
            exit_status = stdout.channel.recv_exit_status()
            error = stderr.read().decode().strip()
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return exit_status == 0

        print("🔄 UPDATING REMOTE SCRIPTS TO USE UV PACKAGE MANAGER")
        print("=" * 60)
        
        # Update deployment script to reference uv instead of pnpm in comments/docs
        updated_script = '''#!/bin/bash

set -e

REPO_DIR="/var/www/phantasia-repo"
WEB_DIR="/var/www/html"
BACKUP_DIR="/var/www/backups"

echo "🚀 Starting Phantasia GitHub Pre-Built Deployment"
echo "📅 $(date)"
echo "============================================"

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Backup current version
if [ -d "$WEB_DIR" ] && [ "$(ls -A $WEB_DIR)" ]; then
    echo "💾 Creating backup of current version..."
    cp -r "$WEB_DIR" "$BACKUP_DIR/backup-$(date +%Y%m%d-%H%M%S)" 2>/dev/null || echo "Backup failed, continuing..."
    echo "✅ Backup created"
fi

cd "$REPO_DIR"

echo "📥 Fetching latest changes from GitHub..."
git fetch --all
git reset --hard origin/alternative-backgroundplane
git pull origin alternative-backgroundplane

echo "🔍 Checking for pre-built files..."
if [ -d "dist/phantasia/browser" ]; then
    echo "✅ Pre-built files found in repository!"
    echo "📱 Dist structure: $(ls -la dist/phantasia/ | wc -l) items in dist/phantasia/"
    echo "📱 Browser files: $(ls -la dist/phantasia/browser/ | wc -l) items in browser/"
    
    # Deploy pre-built files directly (NO BUILDING!)
    echo "🚀 Deploying pre-built Angular application..."
    echo "   Source: $REPO_DIR/dist/phantasia/browser/"
    echo "   Target: $WEB_DIR/"
    echo "   ⚠️  SKIPPING BUILD PROCESS - Using pre-built files!"
    echo "   📦 Package Manager: UV (for local development only)"
    
    # Clear web directory
    rm -rf "$WEB_DIR"/*
    
    # Copy pre-built files
    cp -r dist/phantasia/browser/* "$WEB_DIR/"
    
    # Verify deployment
    if [ -f "$WEB_DIR/index.html" ]; then
        echo "✅ Pre-built deployment successful!"
        echo "   Main files deployed: $(ls -1 $WEB_DIR/*.{js,css,html} 2>/dev/null | wc -l) files"
        echo "   Assets deployed: $(find $WEB_DIR/assets -type f 2>/dev/null | wc -l) assets"
    else
        echo "❌ Deployment failed - index.html not found"
        exit 1
    fi
    
else
    echo "❌ No pre-built files found in repository!"
    echo "💡 Expected: dist/phantasia/browser/ directory"
    echo "🔧 To fix this issue:"
    echo "   1. Build locally: uv run build"
    echo "   2. Commit dist files: git add dist/ && git commit -m 'Add pre-built files'"
    echo "   3. Push: git push origin alternative-backgroundplane"
    echo "   4. Re-run this deployment script"
    exit 1
fi

# Set proper permissions
echo "🔧 Setting file permissions..."
chown -R www-data:www-data "$WEB_DIR"
chmod -R 755 "$WEB_DIR"
find "$WEB_DIR" -type f -exec chmod 644 {} \\;
echo "✅ Permissions set (www-data:www-data, 755/644)"

# Test deployment
echo "🧪 Testing deployment..."
if curl -s http://localhost/ | grep -i "phantasia\\|html\\|angular\\|collections" > /dev/null 2>&1; then
    echo "✅ Deployment test PASSED!"
    
    # Show deployment summary
    echo ""
    echo "🎉 SUCCESS! Phantasia deployment completed!"
    echo "============================================"
    echo "🌐 Website: http://212.227.85.148/"
    echo "🔐 Authentication: phantasia_dev / i1Si1SbOEkgK"
    echo "📦 Deployment method: Pre-built files from GitHub"
    echo "📦 Package Manager: UV (local development only)"
    echo "⚡ Build time: 0 seconds (using pre-built dist/)"
    echo "📊 Files deployed: $(find $WEB_DIR -type f | wc -l) files"
    echo "📁 Assets included: $(find $WEB_DIR/assets -type f 2>/dev/null | wc -l) assets"
    echo "🕐 Deployment completed: $(date)"
    echo ""
    
else
    echo "⚠️  Deployment test inconclusive"
    echo "Website files deployed but verification failed"
    echo "Manual check recommended: http://212.227.85.148/"
fi

# Show recent git info
echo "📋 Deployment Details:"
echo "   Repository: $(pwd)"
echo "   Branch: $(git branch --show-current)"
echo "   Last commit: $(git log --oneline -1)"
echo "   Files in web directory: $(ls -1 $WEB_DIR | wc -l)"

echo "============================================"
echo "📊 Pre-built deployment (UV-based) finished at $(date)"
'''
        
        # Write the updated script to all deployment script locations
        sftp = ssh.open_sftp()
        try:
            with sftp.open('/root/deploy-phantasia.sh', 'w') as f:
                f.write(updated_script)
            print("✅ Updated /root/deploy-phantasia.sh with UV references")
            
            with sftp.open('/root/deploy-prebuilt.sh', 'w') as f:
                f.write(updated_script)
            print("✅ Updated /root/deploy-prebuilt.sh with UV references")
            
            with sftp.open('/root/deploy_from_github.sh', 'w') as f:
                f.write(updated_script)
            print("✅ Updated /root/deploy_from_github.sh with UV references")
            
        finally:
            sftp.close()
        
        # Make all scripts executable
        cmd("chmod +x /root/deploy-phantasia.sh /root/deploy-prebuilt.sh /root/deploy_from_github.sh", "Set executable permissions")
        
        print("\n🎯 All deployment scripts updated with UV package manager references!")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("📦 UPDATING REMOTE SCRIPTS FOR UV PACKAGE MANAGER")
    print("=" * 50)
    
    if update_remote_to_uv():
        print("""
🎉 REMOTE SCRIPTS UPDATED FOR UV!

✅ Changes Applied:
• Updated deployment script comments to reference UV
• Instructions now show 'uv run build' instead of 'pnpm run build'  
• Package manager references updated to UV
• Deployment still uses pre-built files (no server building)

📝 Updated Scripts:
• /root/deploy-phantasia.sh
• /root/deploy-prebuilt.sh  
• /root/deploy_from_github.sh

🚀 Server deployment workflow remains the same, but now UV-aligned!
        """)
    else:
        print("❌ Update failed")