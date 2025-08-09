#!/usr/bin/env python3

import paramiko
import time

# Server details  
SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def run_command(ssh, cmd):
    print(f"Running: {cmd}")
    stdin, stdout, stderr = ssh.exec_command(cmd)
    output = stdout.read().decode().strip()
    error = stderr.read().decode().strip()
    
    if output:
        print(f"Output: {output}")
    if error:
        print(f"Error: {error}")
    
    return stdout.channel.recv_exit_status() == 0

def deploy():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        # Stop both Apache and nginx
        print("\n🔧 Stopping web servers...")
        run_command(ssh, "systemctl stop apache2 2>/dev/null || true")
        run_command(ssh, "systemctl disable apache2 2>/dev/null || true") 
        run_command(ssh, "systemctl stop nginx 2>/dev/null || true")
        
        # Extract the deployment files
        print("\n📁 Setting up files...")
        run_command(ssh, "mkdir -p /root/Projects/ProjectPhantasia")
        run_command(ssh, "cd /root/Projects/ProjectPhantasia && rm -rf * && tar -xzf /root/phantasia-deploy.tar.gz")
        run_command(ssh, "chmod -R 755 /root/Projects/ProjectPhantasia")
        
        # Verify index.html exists
        if run_command(ssh, "test -f /root/Projects/ProjectPhantasia/index.html"):
            print("✅ index.html found")
        else:
            print("❌ index.html not found!")
            return False
        
        # Configure nginx with a very simple config
        print("\n⚙️ Configuring nginx...")
        nginx_config = """server {
    listen 80;
    server_name _;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}"""
        
        config_cmd = f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config}\nEOF"
        run_command(ssh, config_cmd)
        
        # Test and start nginx
        print("\n🚀 Starting nginx...")
        if run_command(ssh, "nginx -t"):
            if run_command(ssh, "systemctl start nginx"):
                if run_command(ssh, "systemctl enable nginx"):
                    print("✅ nginx started successfully")
                    
                    # Test the website
                    print("\n🧪 Testing website...")
                    time.sleep(2)
                    
                    if run_command(ssh, "curl -I http://localhost/"):
                        print("✅ Website is responding!")
                        
                        # Get a sample of the content
                        run_command(ssh, "curl -s http://localhost/ | head -5")
                        
                        ssh.close()
                        return True
                    
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        return False

def test_external():
    print("\n🌐 Testing external access...")
    import urllib.request
    
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=15)
        content = response.read(1000).decode('utf-8', errors='ignore')
        
        print(f"Status: {response.getcode()}")
        if 'phantasia' in content.lower() or 'angular' in content.lower():
            print("✅ Phantasia website detected!")
        else:
            print("⚠️ Different content detected")
            print(f"Preview: {content[:200]}")
            
        return response.getcode() == 200
        
    except Exception as e:
        print(f"❌ External test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 FINAL DEPLOYMENT - Project Phantasia")
    print("=" * 50)
    
    if deploy():
        if test_external():
            print("\n🎉🎉🎉 DEPLOYMENT SUCCESSFUL! 🎉🎉🎉")
            print(f"\n🌟 Your Phantasia website is now live at:")
            print(f"   🌐 http://{SERVER_IP}/")
            
            print(f"\n📋 Deployment Summary:")
            print(f"   📁 Location: /root/Projects/ProjectPhantasia/")
            print(f"   ⚙️ Web Server: nginx")
            print(f"   🌍 URL: http://{SERVER_IP}/")
            print(f"   ✅ Status: RUNNING")
        else:
            print("⚠️ Deployment completed but external access issues detected")
    else:
        print("❌ Deployment failed")