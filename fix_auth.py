#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def fix_auth():
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
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        # Check current nginx error logs
        cmd("tail -10 /var/log/nginx/error.log", "Checking nginx error logs")
        
        # Check permissions on the password file
        cmd("ls -la /etc/nginx/.htpasswd", "Checking password file permissions")
        
        # Check if the password file is readable by nginx
        cmd("sudo -u www-data cat /etc/nginx/.htpasswd", "Testing if nginx can read password file")
        
        # Fix permissions on password file
        cmd("chown www-data:www-data /etc/nginx/.htpasswd", "Setting correct ownership")
        cmd("chmod 644 /etc/nginx/.htpasswd", "Setting correct permissions")
        
        # Check project directory permissions
        cmd("ls -la /root/Projects/ProjectPhantasia/", "Checking project directory permissions")
        
        # The issue might be that nginx can't access /root directory
        # Let's create a symlink in a more accessible location
        cmd("mkdir -p /var/www/phantasia", "Creating accessible directory")
        cmd("cp -r /root/Projects/ProjectPhantasia/* /var/www/phantasia/", "Copying files to accessible location")
        cmd("chown -R www-data:www-data /var/www/phantasia", "Setting correct ownership on web files")
        cmd("chmod -R 755 /var/www/phantasia", "Setting correct permissions on web files")
        
        # Create updated nginx config pointing to accessible location
        nginx_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    # Basic Authentication
    auth_basic "Phantasia Testing Site - Access Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets with caching
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
        
        # Write the corrected config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config}\nEOF")
        stdout.channel.recv_exit_status()
        print("\n✅ Updated nginx configuration with accessible path")
        
        # Test and reload nginx
        if cmd("nginx -t", "Testing nginx configuration"):
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("\n✅ nginx reloaded successfully!")
                
                import time
                time.sleep(2)
                
                # Test authentication
                print("\n🧪 Testing authentication...")
                
                # Test without auth (should get 401)
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Testing without authentication (should be 401)")
                
                # Test with auth (should work)
                cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null | head -3", "Testing with authentication")
                
                # Get the content with auth to make sure it's working
                cmd("curl -s -u phantasia_dev:i1Si1SbOEkgK http://localhost/ | head -5", "Getting content with authentication")
                
                ssh.close()
                return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Fix failed: {str(e)}")
        return False

def test_external_auth():
    print("\n🌐 Testing external authentication...")
    import urllib.request
    import base64
    
    username = "phantasia_dev"
    password = "i1Si1SbOEkgK"
    
    try:
        # Test without authentication (should get 401)
        try:
            response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
            print(f"⚠️ No auth required - Status: {response.getcode()}")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print("✅ Authentication is required (401 Unauthorized)")
            else:
                print(f"❓ Status: {e.code}")
        
        # Test with correct authentication
        credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
        request = urllib.request.Request(f"http://{SERVER_IP}/")
        request.add_header("Authorization", f"Basic {credentials}")
        
        response = urllib.request.urlopen(request, timeout=10)
        if response.getcode() == 200:
            content = response.read(200).decode('utf-8', errors='ignore')
            print("✅ Authentication successful!")
            print(f"Content preview: {content[:100]}...")
            return True, username, password
        
    except Exception as e:
        print(f"External test error: {str(e)}")
    
    return False, username, password

if __name__ == "__main__":
    print("🔧 Fixing Authentication Issues")
    print("=" * 50)
    
    if fix_auth():
        success, username, password = test_external_auth()
        
        if success:
            print("\n🎉🎉🎉 AUTHENTICATION IS NOW WORKING! 🎉🎉🎉")
            print(f"\n🔐 Website Access Credentials:")
            print(f"   🌐 URL: http://{SERVER_IP}/")
            print(f"   👤 Username: {username}")
            print(f"   🔑 Password: {password}")
            print(f"\n📋 Security Status:")
            print(f"   ✅ Website is now password protected")
            print(f"   ✅ Only users with credentials can access")
            print(f"   ✅ All routes require authentication")
            print(f"   📁 Files location: /var/www/phantasia/")
        else:
            print(f"\n⚠️ Please test manually:")
            print(f"   🌐 URL: http://{SERVER_IP}/")
            print(f"   👤 Username: {username}")
            print(f"   🔑 Password: {password}")
    else:
        print("\n❌ Failed to fix authentication issues")