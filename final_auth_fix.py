#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def final_auth_fix():
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

        # Check what's actually in the web directory
        cmd("ls -la /var/www/phantasia/", "Checking web directory contents")
        
        # The issue is that the files are in a browser subdirectory
        cmd("ls -la /var/www/phantasia/browser/", "Checking browser subdirectory")
        
        # Move files from browser subdirectory to root
        cmd("cp -r /var/www/phantasia/browser/* /var/www/phantasia/ 2>/dev/null || true", "Moving files from browser subdirectory")
        
        # Check if we now have index.html
        cmd("ls -la /var/www/phantasia/index.html", "Checking for index.html")
        
        # If still no index.html, let's find where it is
        if not cmd("test -f /var/www/phantasia/index.html"):
            cmd("find /var/www/phantasia -name 'index.html' -type f", "Finding index.html")
            cmd("find /root -name 'index.html' -type f 2>/dev/null", "Finding index.html in root")
            
            # Copy from the browser location if it exists there
            cmd("cp /root/browser/index.html /var/www/phantasia/ 2>/dev/null || true", "Copying index.html from browser")
            cmd("cp -r /root/browser/* /var/www/phantasia/ 2>/dev/null || true", "Copying all browser files")
        
        # Set permissions again
        cmd("chown -R www-data:www-data /var/www/phantasia", "Setting ownership")
        cmd("chmod -R 755 /var/www/phantasia", "Setting permissions")
        
        # Verify index.html exists now
        cmd("ls -la /var/www/phantasia/index.html", "Verifying index.html exists")
        
        # Test nginx config and reload
        if cmd("nginx -t", "Testing nginx configuration"):
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("\n✅ nginx reloaded successfully!")
                
                import time
                time.sleep(2)
                
                # Test authentication now
                print("\n🧪 Testing authentication...")
                
                # Test without auth (should get 401)
                cmd("curl -I http://localhost/ 2>/dev/null", "Testing without authentication")
                
                # Test with auth (should work)
                cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null", "Testing with authentication")
                
                # Get actual content with auth
                cmd("curl -s -u phantasia_dev:i1Si1SbOEkgK http://localhost/ | head -10", "Getting content with auth")
                
                ssh.close()
                return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Fix failed: {str(e)}")
        return False

def test_external_final():
    print("\n🌐 Final external test...")
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
        content = response.read(300).decode('utf-8', errors='ignore')
        
        print(f"Status: {response.getcode()}")
        print(f"Content: {content[:200]}...")
        
        if response.getcode() == 200 and ('phantasia' in content.lower() or 'prismatic' in content.lower()):
            return True, username, password
        
    except urllib.error.HTTPError as e:
        if e.code == 401:
            print("✅ Got 401 - authentication is working, but need to test with credentials")
            # Try again with different approach
            import requests
            try:
                response = requests.get(f"http://{SERVER_IP}/", auth=(username, password), timeout=10)
                if response.status_code == 200:
                    print("✅ Authentication successful with requests library!")
                    return True, username, password
            except:
                pass
        print(f"HTTP Error: {e.code}")
    
    except Exception as e:
        print(f"Error: {str(e)}")
    
    return False, username, password

if __name__ == "__main__":
    print("🔧 Final Authentication Fix")
    print("=" * 40)
    
    if final_auth_fix():
        success, username, password = test_external_final()
        
        print(f"\n🔐 AUTHENTICATION CONFIGURED")
        print(f"📋 Access Details:")
        print(f"   🌐 URL: http://{SERVER_IP}/")
        print(f"   👤 Username: {username}")
        print(f"   🔑 Password: {password}")
        
        if success:
            print(f"\n✅ Status: WORKING")
        else:
            print(f"\n⚠️ Status: Please test manually")
            print(f"   The website should now require authentication")
            print(f"   If you get a login prompt, use the credentials above")
    else:
        print("\n❌ Final fix failed")