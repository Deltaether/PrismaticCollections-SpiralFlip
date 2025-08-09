#!/usr/bin/env python3

import paramiko
import time
import sys
import os

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
        if error:
            print(f"   ⚠️ Error: {error}")
            
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

def fix_deployment():
    try:
        # Connect to SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        print(f"🔐 Connecting to {USERNAME}@{SERVER_IP}:{PORT}...")
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ SSH connection successful!")
        
        # Check if the file exists locally
        if not os.path.exists("phantasia-deploy.tar.gz"):
            print("❌ phantasia-deploy.tar.gz not found!")
            return False
        
        print("📤 Uploading new deployment package...")
        sftp = ssh.open_sftp()
        sftp.put("phantasia-deploy.tar.gz", "/root/phantasia-deploy.tar.gz")
        sftp.close()
        print("✅ Upload completed!")
        
        # Check nginx status first
        execute_step(ssh, "Check nginx status", "systemctl status nginx --no-pager")
        
        # Stop nginx temporarily 
        execute_step(ssh, "Stop nginx", "systemctl stop nginx")
        
        # Clean up and extract files
        execute_step(ssh, "Clean project directory", "rm -rf /root/Projects/ProjectPhantasia/*")
        execute_step(ssh, "Extract new files", "cd /root/Projects/ProjectPhantasia && tar -xzf /root/phantasia-deploy.tar.gz")
        execute_step(ssh, "Set permissions", "chmod -R 755 /root/Projects/ProjectPhantasia")
        execute_step(ssh, "List files", "ls -la /root/Projects/ProjectPhantasia")
        
        # Check if index.html exists
        execute_step(ssh, "Verify index.html", "ls -la /root/Projects/ProjectPhantasia/index.html")
        
        # Create a simple nginx config
        simple_nginx_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /root/Projects/ProjectPhantasia;
    index index.html index.htm;
    
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}'''
        
        # Write simpler nginx config
        config_command = f"cat > /etc/nginx/sites-available/phantasia << 'EOF'\n{simple_nginx_config}\nEOF"
        execute_step(ssh, "Write simple nginx config", config_command)
        
        # Check nginx config syntax
        if execute_step(ssh, "Test nginx config", "nginx -t"):
            # Start nginx
            if execute_step(ssh, "Start nginx", "systemctl start nginx"):
                if execute_step(ssh, "Enable nginx", "systemctl enable nginx"):
                    
                    time.sleep(2)
                    
                    # Test the website
                    if execute_step(ssh, "Test website", "curl -I http://localhost/"):
                        # Test that we get actual content
                        execute_step(ssh, "Get website content", "curl -s http://localhost/ | head -20")
                        
                        ssh.close()
                        return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Fix deployment failed: {str(e)}")
        return False

def test_external():
    import urllib.request
    
    print("\n🧪 Testing external accessibility...")
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
        content = response.read(500).decode('utf-8', errors='ignore')
        
        print(f"✅ Status: {response.getcode()}")
        print(f"✅ Content preview: {content[:200]}...")
        
        if response.getcode() == 200:
            return True
        return False
            
    except Exception as e:
        print(f"❌ External test failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Fixing deployment issues...")
    print("=" * 50)
    
    if fix_deployment():
        print("\n" + "=" * 50)
        print("🎉 DEPLOYMENT FIXED!")
        
        if test_external():
            print("\n🎉🎉🎉 WEBSITE IS NOW RUNNING! 🎉🎉🎉")
            print(f"\n📍 Access your website at:")
            print(f"   🌐 http://{SERVER_IP}/")
            print(f"   📁 Files: /root/Projects/ProjectPhantasia/")
        else:
            print("\n⚠️ Server is running but external access might be limited")
    else:
        print("\n❌ Failed to fix deployment!")