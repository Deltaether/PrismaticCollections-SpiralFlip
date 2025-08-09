#!/usr/bin/env python3

import paramiko
import time
import sys

# Server details
SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def execute_step(ssh, step_name, command, timeout=60):
    print(f"🔧 {step_name}")
    print(f"   Command: {command}")
    
    try:
        stdin, stdout, stderr = ssh.exec_command(command, timeout=timeout)
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()
        
        if output:
            print(f"   ✅ Output: {output}")
        if error and not any(word in error.lower() for word in ['warning', 'note', 'info']):
            print(f"   ⚠️ Error: {error}")
            
        # Check exit status
        exit_status = stdout.channel.recv_exit_status()
        if exit_status == 0:
            print(f"   ✅ {step_name} completed successfully")
            return True
        else:
            print(f"   ❌ {step_name} failed with exit code {exit_status}")
            return False
            
    except Exception as e:
        print(f"   ❌ {step_name} failed: {str(e)}")
        return False

def deploy():
    try:
        # Connect to SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print(f"🔐 Connecting to {USERNAME}@{SERVER_IP}:{PORT}...")
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ SSH connection successful!")
        
        # Step 1: Create project directory and extract files
        if execute_step(ssh, "Creating project directory", "mkdir -p /root/Projects/ProjectPhantasia"):
            if execute_step(ssh, "Extracting deployment files", "cd /root/Projects/ProjectPhantasia && tar -xzf /root/phantasia-deploy.tar.gz"):
                if execute_step(ssh, "Setting permissions", "chmod -R 755 /root/Projects/ProjectPhantasia"):
                    execute_step(ssh, "Listing files", "ls -la /root/Projects/ProjectPhantasia | head -10")
        
        # Step 2: Update system
        execute_step(ssh, "Updating system", "apt update", timeout=120)
        
        # Step 3: Install nginx
        if execute_step(ssh, "Installing nginx", "apt install -y nginx", timeout=120):
            
            # Step 4: Configure nginx
            nginx_config = '''server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    # Handle Angular routing - all routes go to index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets with caching
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
            
            # Write nginx config
            config_command = f"cat > /etc/nginx/sites-available/phantasia << 'EOF'\n{nginx_config}\nEOF"
            if execute_step(ssh, "Writing nginx config", config_command):
                
                # Enable the site
                if execute_step(ssh, "Enabling site", "ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/"):
                    if execute_step(ssh, "Removing default site", "rm -f /etc/nginx/sites-enabled/default"):
                        if execute_step(ssh, "Testing nginx config", "nginx -t"):
                            if execute_step(ssh, "Starting nginx", "systemctl restart nginx"):
                                if execute_step(ssh, "Enabling nginx", "systemctl enable nginx"):
                                    
                                    # Wait a moment for nginx to start
                                    print("⏳ Waiting for nginx to start...")
                                    time.sleep(3)
                                    
                                    # Test the deployment
                                    if execute_step(ssh, "Testing local website", "curl -I http://localhost/"):
                                        print("🎉 Nginx is serving the website!")
                                        
                                        # Test specific routes
                                        routes = ["", "phantasia", "collections", "home"]
                                        for route in routes:
                                            cmd = f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost/{route}"
                                            if execute_step(ssh, f"Testing route /{route}", cmd):
                                                pass
                                        
                                        ssh.close()
                                        return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        return False

def test_external():
    import urllib.request
    
    print("\n🧪 Testing external accessibility...")
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
        if response.getcode() == 200:
            print("✅ Website is accessible from external network!")
            
            # Read a bit of content to verify it's the right site
            content = response.read(1000).decode('utf-8', errors='ignore')
            if 'phantasia' in content.lower() or 'angular' in content.lower():
                print("✅ Website content looks correct!")
            
            return True
        else:
            print(f"⚠️ Website returned status: {response.getcode()}")
            return False
            
    except Exception as e:
        print(f"❌ External test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Starting focused deployment for Project Phantasia")
    print("=" * 50)
    
    if deploy():
        print("\n" + "=" * 50)
        print("🎉 SERVER DEPLOYMENT COMPLETED!")
        
        # Test external access
        if test_external():
            print("\n🎉🎉🎉 DEPLOYMENT FULLY SUCCESSFUL! 🎉🎉🎉")
            print(f"\n📍 Project Phantasia is now live at:")
            print(f"   🌐 http://{SERVER_IP}/")
            print(f"   🎵 http://{SERVER_IP}/phantasia")
            print(f"   📚 http://{SERVER_IP}/collections")
            print(f"\n🔧 Server details:")
            print(f"   📁 Files: /root/Projects/ProjectPhantasia/")
            print(f"   ⚙️ nginx: /etc/nginx/sites-available/phantasia")
            sys.exit(0)
        else:
            print("\n⚠️ Server deployment succeeded but external access failed")
            print("Check firewall settings or network configuration")
            sys.exit(1)
    else:
        print("\n❌ Deployment failed!")
        sys.exit(1)