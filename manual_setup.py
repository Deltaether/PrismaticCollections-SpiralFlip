#!/usr/bin/env python3

import paramiko
import time
import sys

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def manual_setup():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server for manual setup")
        
        def cmd(command, desc=""):
            if desc:
                print(f"\n🔧 {desc}")
            print(f"$ {command}")
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        # First, let's see what's currently running
        cmd("systemctl status apache2 --no-pager -l", "Checking Apache status")
        cmd("systemctl status nginx --no-pager -l", "Checking Nginx status")
        
        # Check what's in the project directory
        cmd("ls -la /root/Projects/ProjectPhantasia/", "Checking project directory")
        
        # Check if we have a valid deployment file
        cmd("ls -la /root/phantasia*.tar.gz", "Checking deployment files")
        
        # Stop Apache to free up port 80
        print("\n🛑 Stopping Apache to free up port 80...")
        cmd("systemctl stop apache2")
        cmd("systemctl disable apache2")
        
        # Use the latest deployment file
        print("\n📁 Setting up project files...")
        cmd("mkdir -p /root/Projects/ProjectPhantasia")
        
        # Try to extract from the latest file
        if cmd("tar -tzf /root/phantasia-fresh.tar.gz 2>/dev/null | head -5"):
            print("Using phantasia-fresh.tar.gz")
            cmd("cd /root/Projects/ProjectPhantasia && rm -rf * && tar -xzf /root/phantasia-fresh.tar.gz")
        else:
            print("Fresh file not ready, using existing phantasia-deploy.tar.gz")
            cmd("cd /root/Projects/ProjectPhantasia && rm -rf * && tar -xzf /root/phantasia-deploy.tar.gz")
        
        cmd("chmod -R 755 /root/Projects/ProjectPhantasia")
        
        # Verify we have index.html
        if not cmd("test -f /root/Projects/ProjectPhantasia/index.html"):
            print("❌ No index.html found, trying to copy from dist files...")
            # Try to find index.html in various locations
            cmd("find /root -name 'index.html' -type f 2>/dev/null | head -5")
            # If we find browser folder, use that
            if cmd("test -d /root/browser"):
                cmd("cp -r /root/browser/* /root/Projects/ProjectPhantasia/")
        
        # List what we have now
        cmd("ls -la /root/Projects/ProjectPhantasia/ | head -10", "Files in project directory")
        
        # Create nginx config
        print("\n⚙️ Configuring nginx...")
        nginx_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Angular routes
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
}'''
        
        # Write the config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config}\nEOF")
        stdout.channel.recv_exit_status()  # Wait for completion
        
        # Test and start nginx
        print("\n🚀 Starting nginx...")
        if cmd("nginx -t"):
            if cmd("systemctl start nginx"):
                cmd("systemctl enable nginx")
                print("✅ nginx started successfully!")
                
                # Wait a moment
                time.sleep(2)
                
                # Test the website
                print("\n🧪 Testing website...")
                cmd("curl -I http://localhost/")
                
                # Get content preview
                cmd("curl -s http://localhost/ | head -10")
                
                # Test specific routes
                for route in ["", "phantasia", "collections"]:
                    cmd(f"curl -s -o /dev/null -w 'Route /{route}: %{{http_code}}\\n' http://localhost/{route}")
                
                ssh.close()
                return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Manual setup failed: {str(e)}")
        return False

def test_external():
    print("\n🌐 Testing external access...")
    import urllib.request
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
        content = response.read(500).decode('utf-8', errors='ignore')
        print(f"Status: {response.getcode()}")
        print(f"Content preview: {content[:200]}...")
        return response.getcode() == 200
    except Exception as e:
        print(f"External test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Manual Server Setup - Project Phantasia")
    print("=" * 50)
    
    if manual_setup():
        if test_external():
            print("\n🎉🎉🎉 PHANTASIA IS NOW LIVE! 🎉🎉🎉")
            print(f"🌐 Visit: http://{SERVER_IP}/")
        else:
            print("⚠️ Setup complete but external access may need firewall configuration")
    else:
        print("❌ Manual setup failed")