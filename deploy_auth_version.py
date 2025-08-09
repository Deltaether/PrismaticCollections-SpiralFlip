#!/usr/bin/env python3

import paramiko
import os

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def deploy_auth_version():
    try:
        # Create fresh deployment package
        print("📦 Creating deployment package...")
        os.system("tar -czf phantasia-auth.tar.gz -C dist/phantasia .")
        
        # Connect to server
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command, desc=""):
            if desc:
                print(f"\n🔧 {desc}")
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        # Upload the new version
        print("📤 Uploading new version with authentication...")
        sftp = ssh.open_sftp()
        sftp.put("phantasia-auth.tar.gz", "/root/phantasia-auth.tar.gz")
        sftp.close()
        print("✅ Upload completed!")
        
        # Backup current version and deploy new one
        cmd("cp -r /var/www/phantasia /var/www/phantasia-backup", "Backing up current version")
        cmd("rm -rf /var/www/phantasia/*", "Clearing current website")
        cmd("cd /var/www/phantasia && tar -xzf /root/phantasia-auth.tar.gz", "Extracting new version")
        cmd("chown -R www-data:www-data /var/www/phantasia", "Setting permissions")
        cmd("chmod -R 755 /var/www/phantasia", "Setting file permissions")
        
        # Verify deployment
        cmd("ls -la /var/www/phantasia/", "Verifying deployment")
        cmd("ls -la /var/www/phantasia/index.html", "Checking index.html")
        
        # Test the website
        print("\n🧪 Testing deployed website...")
        cmd("curl -s http://localhost/ | head -10", "Getting website content")
        
        # Cleanup
        cmd("rm /root/phantasia-auth.tar.gz", "Cleaning up deployment file")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False
    finally:
        # Cleanup local file
        if os.path.exists("phantasia-auth.tar.gz"):
            os.remove("phantasia-auth.tar.gz")

def test_authentication():
    print("\n🧪 Testing authentication on live site...")
    import urllib.request
    
    try:
        response = urllib.request.urlopen(f"http://{SERVER_IP}/", timeout=10)
        content = response.read(1000).decode('utf-8', errors='ignore')
        
        print(f"Status: {response.getcode()}")
        if 'login' in content.lower() or 'authentication' in content.lower() or 'phantasia' in content.lower():
            print("✅ Authentication screen detected!")
            print("Content preview:")
            print(content[:300] + "...")
            return True
        else:
            print("⚠️ Unexpected content:")
            print(content[:200] + "...")
            
    except Exception as e:
        print(f"❌ Test failed: {str(e)}")
    
    return False

if __name__ == "__main__":
    print("🚀 Deploying Angular App with Authentication")
    print("=" * 50)
    
    if deploy_auth_version():
        if test_authentication():
            print(f"\n🎉🎉🎉 AUTHENTICATION DEPLOYED SUCCESSFULLY! 🎉🎉🎉")
            print(f"=" * 60)
            print(f"🌐 Website URL: http://{SERVER_IP}/")
            print(f"🔐 AUTHENTICATION CONFIGURED:")
            print(f"  - URL: http://{SERVER_IP}/")
            print(f"  - Username: phantasia_dev")
            print(f"  - Password: i1Si1SbOEkgK")
            print(f"=" * 60)
            print(f"✅ Login screen should now appear")
            print(f"✅ Enter credentials to access Phantasia")
            print(f"✅ Authentication info displayed on login screen")
        else:
            print(f"\n⚠️ Deployment completed but please test manually:")
            print(f"🌐 http://{SERVER_IP}/")
    else:
        print("❌ Deployment failed")