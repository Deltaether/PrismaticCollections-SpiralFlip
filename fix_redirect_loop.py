#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def fix_redirect_loop():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command, desc=""):
            if desc:
                print(f"\n🔧 {desc}")
            print(f"$ {command}")
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error:
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        print("🔧 The issue is an infinite redirect loop in try_files directive")
        print("🔧 Creating proper nginx config to fix this...")
        
        # Create correct nginx config that avoids the redirect loop
        fixed_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    # Basic Authentication
    auth_basic "Phantasia Testing Site";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    # Main location - this fixes the redirect loop
    location / {
        try_files $uri $uri/ @fallback;
    }
    
    # Fallback for Angular routing
    location @fallback {
        rewrite ^.*$ /index.html last;
    }
    
    # Static assets
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
        
        # Write the fixed config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{fixed_config}\nEOF")
        stdout.channel.recv_exit_status()
        print("✅ Fixed nginx configuration written")
        
        # Test and reload
        if cmd("nginx -t", "Testing fixed configuration"):
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("✅ nginx reloaded with fixed config!")
                
                import time
                time.sleep(2)
                
                # Test the fixed website
                print("\n🧪 Testing fixed website...")
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Test without auth (should get 401)")
                cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null | head -3", "Test with auth (should get 200)")
                
                # Get actual content
                cmd("curl -s -u phantasia_dev:i1Si1SbOEkgK http://localhost/ | head -5", "Get page content")
                
                ssh.close()
                return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def final_test():
    print("\n🌐 Final external test...")
    import urllib.request
    import base64
    
    try:
        # Test without auth (should get 401)
        try:
            response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
            print(f"⚠️ No auth required - got {response.getcode()}")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print("✅ 401 Unauthorized - authentication working!")
            else:
                print(f"Status: {e.code}")
        
        # Test with correct auth
        credentials = base64.b64encode("phantasia_dev:i1Si1SbOEkgK".encode()).decode()
        request = urllib.request.Request(f"http://{SERVER_IP}/")
        request.add_header("Authorization", f"Basic {credentials}")
        
        response = urllib.request.urlopen(request, timeout=10)
        if response.getcode() == 200:
            content = response.read(300).decode('utf-8', errors='ignore')
            print(f"✅ SUCCESS! Got 200 with authentication!")
            print(f"Content preview: {content[:150]}...")
            return True
            
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return False

if __name__ == "__main__":
    print("🔧 Fixing nginx Redirect Loop")
    print("=" * 40)
    
    if fix_redirect_loop():
        if final_test():
            print(f"\n🎉🎉🎉 WEBSITE IS NOW WORKING! 🎉🎉🎉")
            print(f"=" * 50)
            print(f"🌐 URL: http://{SERVER_IP}/")
            print(f"👤 Username: phantasia_dev")
            print(f"🔑 Password: i1Si1SbOEkgK")
            print(f"=" * 50)
            print(f"✅ Issue fixed: nginx redirect loop resolved")
            print(f"✅ Authentication: Working")
            print(f"✅ Website: Serving correctly")
        else:
            print(f"\n⚠️ Config fixed but test manually:")
            print(f"🌐 http://{SERVER_IP}/")
    else:
        print("\n❌ Failed to fix redirect loop")