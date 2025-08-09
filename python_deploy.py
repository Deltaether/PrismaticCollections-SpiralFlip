#!/usr/bin/env python3

import paramiko
import sys
import os
import time

# Server details
SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def deploy_phantasia():
    print("🚀 Starting Python-based deployment...")
    
    # Check if deployment file exists
    if not os.path.exists("phantasia-deploy.tar.gz"):
        print("❌ phantasia-deploy.tar.gz not found!")
        return False
    
    try:
        # Create SSH client
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        print(f"🔐 Connecting to {USERNAME}@{SERVER_IP}:{PORT}...")
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD)
        print("✅ SSH connection successful!")
        
        # Create SFTP client for file upload
        print("📤 Uploading deployment package...")
        sftp = ssh.open_sftp()
        sftp.put("phantasia-deploy.tar.gz", "/root/phantasia-deploy.tar.gz")
        sftp.close()
        print("✅ File uploaded successfully!")
        
        # Execute deployment commands
        commands = [
            "echo '🚀 Starting server setup...'",
            "apt update",
            "apt install -y nginx",
            "mkdir -p /root/Projects/ProjectPhantasia",
            "cd /root/Projects/ProjectPhantasia",
            "tar -xzf /root/phantasia-deploy.tar.gz",
            "rm /root/phantasia-deploy.tar.gz",
            "chmod -R 755 /root/Projects/ProjectPhantasia/",
            "ls -la | head -10"
        ]
        
        for cmd in commands:
            print(f"🔧 Executing: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd, timeout=60)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(f"   Output: {output}")
            if error and "warning" not in error.lower():
                print(f"   Error: {error}")
                
        # Configure nginx
        nginx_config = '''server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
        
        print("🔧 Configuring nginx...")
        ssh.exec_command(f"cat > /etc/nginx/sites-available/phantasia << 'EOF'\n{nginx_config}\nEOF")
        
        nginx_commands = [
            "ln -sf /etc/nginx/sites-available/phantasia /etc/nginx/sites-enabled/",
            "rm -f /etc/nginx/sites-enabled/default",
            "nginx -t",
            "systemctl restart nginx",
            "systemctl enable nginx"
        ]
        
        for cmd in nginx_commands:
            print(f"🔧 Nginx: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(f"   Output: {output}")
            if error and "warning" not in error.lower():
                print(f"   Error: {error}")
        
        # Test the deployment
        print("🧪 Testing deployment...")
        stdin, stdout, stderr = ssh.exec_command("curl -I http://localhost/")
        output = stdout.read().decode()
        
        if "200 OK" in output:
            print("✅ Website is serving correctly!")
        else:
            print(f"⚠️  Website test result: {output}")
            
        # Test Angular routes
        routes = ["", "phantasia", "collections", "home"]
        for route in routes:
            stdin, stdout, stderr = ssh.exec_command(f"curl -s -o /dev/null -w '%{{http_code}}' http://localhost/{route}")
            status = stdout.read().decode().strip()
            if status == "200":
                print(f"✅ Route /{route}: OK")
            else:
                print(f"❌ Route /{route}: {status}")
        
        ssh.close()
        print("🎉 Deployment completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        return False

def test_website():
    import urllib.request
    
    print("🧪 Testing website from external network...")
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
        if response.getcode() == 200:
            print("✅ Website is accessible externally!")
            
            # Test main routes
            routes = ["phantasia", "collections", "home"]
            for route in routes:
                try:
                    response = urllib.request.urlopen(f"http://{SERVER_IP}/{route}", timeout=10)
                    if response.getcode() == 200:
                        print(f"✅ http://{SERVER_IP}/{route} - Working")
                    else:
                        print(f"⚠️  http://{SERVER_IP}/{route} - Status: {response.getcode()}")
                except Exception as e:
                    print(f"❌ http://{SERVER_IP}/{route} - Error: {str(e)}")
            
            return True
        else:
            print(f"❌ Website returned status: {response.getcode()}")
            return False
            
    except Exception as e:
        print(f"❌ Website test failed: {str(e)}")
        return False

if __name__ == "__main__":
    try:
        import paramiko
        
        if deploy_phantasia():
            time.sleep(5)  # Wait a moment for nginx to fully start
            if test_website():
                print("")
                print("🎉🎉🎉 DEPLOYMENT COMPLETED SUCCESSFULLY! 🎉🎉🎉")
                print("")
                print("📍 Project Phantasia is now live at:")
                print(f"   🌐 http://{SERVER_IP}/")
                print(f"   🎵 http://{SERVER_IP}/phantasia")
                print(f"   📚 http://{SERVER_IP}/collections")
                print("")
                print("🔧 Server details:")
                print("   📁 Files: /root/Projects/ProjectPhantasia/")
                print("   ⚙️  nginx: /etc/nginx/sites-available/phantasia")
                print("")
                sys.exit(0)
            else:
                print("❌ Website is not accessible externally")
                sys.exit(1)
        else:
            sys.exit(1)
            
    except ImportError:
        print("❌ paramiko library not found. Please install with:")
        print("   pip3 install paramiko")
        sys.exit(1)