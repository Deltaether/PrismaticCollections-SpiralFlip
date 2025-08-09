#!/usr/bin/env python3

import paramiko
import secrets
import string

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def setup_basic_auth():
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

        # Generate a secure password for the testing site
        auth_username = "phantasia_dev"
        auth_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(12))
        
        print(f"\n🔐 Setting up authentication:")
        print(f"Username: {auth_username}")
        print(f"Password: {auth_password}")
        
        # Install apache2-utils for htpasswd
        cmd("apt update && apt install -y apache2-utils", "Installing apache2-utils for htpasswd")
        
        # Create the password file
        cmd(f"htpasswd -cb /etc/nginx/.htpasswd {auth_username} {auth_password}", "Creating password file")
        
        # Verify the password file
        cmd("ls -la /etc/nginx/.htpasswd && cat /etc/nginx/.htpasswd", "Verifying password file")
        
        # Create new nginx config with authentication
        nginx_config_with_auth = f'''server {{
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /root/Projects/ProjectPhantasia;
    index index.html;
    server_name _;
    
    # Basic Authentication for the entire site
    auth_basic "Phantasia Testing Site - Access Restricted";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {{
        try_files $uri $uri/ /index.html;
    }}
    
    # Static assets with caching
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {{
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }}
    
    # Angular routes
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {{
        try_files $uri $uri/ /index.html;
    }}
}}'''
        
        # Write the new config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{nginx_config_with_auth}\nEOF")
        stdout.channel.recv_exit_status()
        print("✅ Updated nginx configuration with authentication")
        
        # Test and reload nginx
        if cmd("nginx -t", "Testing nginx configuration"):
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("\n✅ nginx reloaded successfully!")
                
                # Test that authentication is working
                print("\n🧪 Testing authentication...")
                
                # Test without auth (should fail)
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Testing without authentication")
                
                # Test with auth (should work)
                cmd(f"curl -I -u {auth_username}:{auth_password} http://localhost/ 2>/dev/null | head -3", "Testing with authentication")
                
                ssh.close()
                return auth_username, auth_password
        
        ssh.close()
        return None, None
        
    except Exception as e:
        print(f"❌ Setup failed: {str(e)}")
        return None, None

def test_external_auth(username, password):
    print("\n🌐 Testing external authentication...")
    import urllib.request
    import base64
    
    try:
        # Test without authentication (should get 401)
        try:
            response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
            print(f"⚠️ No auth required - Status: {response.getcode()}")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print("✅ Authentication is required (401 Unauthorized)")
            else:
                print(f"❌ Unexpected status: {e.code}")
        
        # Test with correct authentication
        credentials = base64.b64encode(f"{username}:{password}".encode()).decode()
        request = urllib.request.Request(f"http://{SERVER_IP}/")
        request.add_header("Authorization", f"Basic {credentials}")
        
        response = urllib.request.urlopen(request, timeout=10)
        if response.getcode() == 200:
            print("✅ Authentication successful! Website accessible with credentials")
            return True
        
    except Exception as e:
        print(f"❌ External auth test failed: {str(e)}")
    
    return False

if __name__ == "__main__":
    print("🔐 Setting up Basic Authentication for Phantasia")
    print("=" * 50)
    
    username, password = setup_basic_auth()
    
    if username and password:
        if test_external_auth(username, password):
            print("\n🎉🎉🎉 AUTHENTICATION SETUP COMPLETE! 🎉🎉🎉")
            print(f"\n🔐 Access Credentials:")
            print(f"   URL: http://{SERVER_IP}/")
            print(f"   Username: {username}")
            print(f"   Password: {password}")
            print(f"\n📋 Important Notes:")
            print(f"   • Save these credentials - they're required to access the site")
            print(f"   • The site is now protected from public access")
            print(f"   • Share these credentials only with authorized testers")
            print(f"   • Password file location: /etc/nginx/.htpasswd")
        else:
            print("\n⚠️ Authentication setup completed but external test failed")
            print("Check the credentials manually")
    else:
        print("\n❌ Failed to set up authentication")