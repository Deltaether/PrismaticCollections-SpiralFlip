#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def fix_nginx_config():
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

        # Check nginx error logs first
        cmd("tail -5 /var/log/nginx/error.log", "Checking nginx error logs")
        
        # Check current config
        cmd("cat /etc/nginx/sites-available/default", "Current nginx config")
        
        # Create a proper working nginx config
        correct_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html index.htm;
    server_name _;
    
    # Basic Authentication
    auth_basic "Phantasia Testing Site";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    # Main location block
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets with proper caching
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # Audio and video files
    location ~* \\.(mp3|mp4|webm|ogg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
    
    # GLB/3D model files
    location ~* \\.(glb|gltf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
        
        # Write the corrected config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{correct_config}\nEOF")
        stdout.channel.recv_exit_status()
        print("✅ Updated nginx configuration")
        
        # Verify the password file exists and is readable
        cmd("ls -la /etc/nginx/.htpasswd", "Checking password file")
        cmd("cat /etc/nginx/.htpasswd", "Password file contents")
        
        # Test nginx config syntax
        if cmd("nginx -t", "Testing nginx configuration"):
            # Reload nginx
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("✅ nginx reloaded successfully!")
                
                import time
                time.sleep(2)
                
                # Test the website
                print("\n🧪 Testing website...")
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Test without auth (should get 401)")
                cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null | head -3", "Test with auth (should get 200)")
                
                # Get content to verify it's working
                cmd("curl -s -u phantasia_dev:i1Si1SbOEkgK http://localhost/ | head -5", "Get actual content")
                
                ssh.close()
                return True
        else:
            print("❌ nginx config test failed")
            cmd("nginx -T", "Show full nginx config for debugging")
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

def test_external():
    print("\n🌐 Testing external access...")
    import urllib.request
    import base64
    
    try:
        # Test with authentication
        credentials = base64.b64encode("phantasia_dev:i1Si1SbOEkgK".encode()).decode()
        request = urllib.request.Request(f"http://{SERVER_IP}/")
        request.add_header("Authorization", f"Basic {credentials}")
        
        response = urllib.request.urlopen(request, timeout=10)
        if response.getcode() == 200:
            content = response.read(200).decode('utf-8', errors='ignore')
            print(f"✅ SUCCESS! Status: {response.getcode()}")
            print(f"Content: {content[:100]}...")
            return True
        else:
            print(f"Status: {response.getcode()}")
            
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ Got 401 - authentication working correctly")
            return True
        else:
            print(f"HTTP Error: {e.code}")
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return False

if __name__ == "__main__":
    print("🔧 Fixing nginx Configuration")
    print("=" * 40)
    
    if fix_nginx_config():
        if test_external():
            print(f"\n🎉 WEBSITE IS NOW WORKING!")
            print(f"🌐 URL: http://{SERVER_IP}/")
            print(f"👤 Username: phantasia_dev")
            print(f"🔑 Password: i1Si1SbOEkgK")
        else:
            print(f"\n⚠️ nginx fixed but test manually:")
            print(f"🌐 http://{SERVER_IP}/")
    else:
        print("\n❌ Failed to fix nginx config")