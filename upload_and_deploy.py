#!/usr/bin/env python3

import paramiko
import os
import time

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def deploy():
    try:
        # First verify the local package is valid
        print("🔍 Checking local deployment package...")
        if not os.path.exists("phantasia-deploy.tar.gz"):
            print("❌ phantasia-deploy.tar.gz not found!")
            return False
        
        # Test the tar file locally
        import subprocess
        result = subprocess.run(["tar", "-tzf", "phantasia-deploy.tar.gz"], capture_output=True, text=True)
        if result.returncode != 0:
            print("❌ Local tar file is corrupted!")
            return False
        
        print("✅ Local deployment package is valid")
        
        # Connect to server
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        # Upload fresh package
        print("📤 Uploading fresh deployment package...")
        sftp = ssh.open_sftp()
        sftp.put("phantasia-deploy.tar.gz", "/root/phantasia-fresh.tar.gz")
        sftp.close()
        print("✅ Upload completed!")
        
        def run_cmd(cmd):
            print(f"Running: {cmd}")
            stdin, stdout, stderr = ssh.exec_command(cmd)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            exit_status = stdout.channel.recv_exit_status()
            
            if output:
                print(f"✅ Output: {output}")
            if error:
                print(f"⚠️ Error: {error}")
            
            return exit_status == 0
        
        # Stop Apache if running
        print("🛑 Stopping Apache...")
        run_cmd("systemctl stop apache2 2>/dev/null || true")
        run_cmd("systemctl disable apache2 2>/dev/null || true")
        
        # Prepare directory and extract
        print("📁 Preparing deployment directory...")
        run_cmd("rm -rf /root/Projects/ProjectPhantasia")
        run_cmd("mkdir -p /root/Projects/ProjectPhantasia")
        
        # Test the uploaded tar file
        print("🔍 Testing uploaded tar file...")
        if run_cmd("tar -tzf /root/phantasia-fresh.tar.gz > /dev/null"):
            print("✅ Uploaded tar file is valid")
            
            # Extract files
            if run_cmd("cd /root/Projects/ProjectPhantasia && tar -xzf /root/phantasia-fresh.tar.gz"):
                print("✅ Files extracted successfully")
                
                # Verify key files
                if run_cmd("ls -la /root/Projects/ProjectPhantasia/index.html"):
                    print("✅ index.html found")
                    
                    # Set permissions
                    run_cmd("chmod -R 755 /root/Projects/ProjectPhantasia")
                    
                    # Configure nginx
                    print("⚙️ Configuring nginx...")
                    nginx_config = """server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}"""
                    
                    # Write config to default site
                    config_cmd = f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config}\nEOF"
                    if run_cmd(config_cmd):
                        print("✅ nginx configured")
                        
                        # Start nginx
                        if run_cmd("nginx -t") and run_cmd("systemctl start nginx") and run_cmd("systemctl enable nginx"):
                            print("✅ nginx started")
                            
                            # Wait and test
                            print("⏳ Waiting for nginx to start...")
                            time.sleep(3)
                            
                            if run_cmd("curl -I http://localhost/"):
                                print("✅ Website is running on server!")
                                
                                # Test external access
                                print("🌐 Testing external access...")
                                import urllib.request
                                try:
                                    response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
                                    if response.getcode() == 200:
                                        content = response.read(500).decode('utf-8', errors='ignore')
                                        print("✅ Website is externally accessible!")
                                        print(f"Preview: {content[:100]}...")
                                        
                                        ssh.close()
                                        return True
                                    else:
                                        print(f"⚠️ Status: {response.getcode()}")
                                except Exception as e:
                                    print(f"❌ External access failed: {str(e)}")
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Deployment failed: {str(e)}")
        return False

if __name__ == "__main__":
    print("🚀 Fresh Upload and Deploy - Project Phantasia")
    print("=" * 60)
    
    if deploy():
        print("\n" + "=" * 60)
        print("🎉🎉🎉 SUCCESS! PHANTASIA IS NOW LIVE! 🎉🎉🎉")
        print(f"\n🌟 Your website is accessible at:")
        print(f"   🌐 http://{SERVER_IP}/")
        print(f"\n📁 Server location: /root/Projects/ProjectPhantasia/")
        print(f"🔧 Web server: nginx")
        print("✅ Status: RUNNING")
    else:
        print("\n❌ Deployment failed!")
        print("Check the errors above and try again.")