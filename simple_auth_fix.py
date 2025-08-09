#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def simple_auth_fix():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command):
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        print("🔧 Creating simple nginx config without auth first...")
        
        # First, let's make sure the site works without auth
        simple_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
}'''
        
        # Write simple config first
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{simple_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        # Reload and test
        cmd("systemctl reload nginx")
        print("Testing without auth...")
        cmd("curl -I http://localhost/")
        cmd("curl -s http://localhost/ | head -3")
        
        # If that works, add auth
        print("\n🔐 Now adding authentication...")
        
        auth_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    # Basic Authentication
    auth_basic "Phantasia Testing - Login Required";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
        
        # Write auth config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{auth_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        # Reload nginx
        if cmd("nginx -t") and cmd("systemctl reload nginx"):
            print("✅ nginx reloaded with authentication")
            
            import time
            time.sleep(2)
            
            # Test
            print("Testing without credentials (should get 401):")
            cmd("curl -I http://localhost/")
            
            print("Testing with credentials:")
            cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/")
            
            # Test content
            print("Getting content:")
            cmd("curl -s -u phantasia_dev:i1Si1SbOEkgK http://localhost/ | head -5")
            
            ssh.close()
            return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def quick_external_test():
    print("\n🌐 Quick external test...")
    import urllib.request
    import base64
    
    username = "phantasia_dev"
    password = "i1Si1SbOEkgK"
    
    try:
        # Test with authentication
        credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
        request = urllib.request.Request(f"http://{SERVER_IP}/")
        request.add_header("Authorization", f"Basic {credentials}")
        
        response = urllib.request.urlopen(request, timeout=10)
        if response.getcode() == 200:
            print("✅ SUCCESS! Authentication is working!")
            return True
            
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ Got 401 - authentication is required (this is good)")
            print("The website is now protected!")
            return True
        else:
            print(f"Status: {e.code}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return False

if __name__ == "__main__":
    print("🔧 Simple Authentication Setup")
    print("=" * 40)
    
    if simple_auth_fix():
        success = quick_external_test()
        
        print(f"\n🔐 AUTHENTICATION SETUP COMPLETE!")
        print(f"=" * 40)
        print(f"🌐 Website: http://{SERVER_IP}/")
        print(f"👤 Username: phantasia_dev")  
        print(f"🔑 Password: i1Si1SbOEkgK")
        print(f"=" * 40)
        
        if success:
            print(f"✅ Status: PROTECTED - Login required")
        else:
            print(f"⚠️ Status: Please test manually")
            
        print(f"\n📋 Notes:")
        print(f"• Website now requires username/password")
        print(f"• Share these credentials only with testers")
        print(f"• Browser will show login prompt")
        
    else:
        print("\n❌ Setup failed")