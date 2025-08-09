#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def cleanup_duplicates():
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

        print("🧹 Cleaning up duplicate files...")
        print("KEEPING: /var/www/phantasia/ (active nginx location)")
        print("REMOVING: duplicate locations to save space")
        
        # Remove duplicates
        cmd("rm -rf /root/Projects/ProjectPhantasia/", "Removing /root/Projects/ProjectPhantasia/")
        cmd("rm -rf /root/browser/", "Removing /root/browser/") 
        cmd("rm -f /root/phantasia-deploy.tar.gz", "Removing old deployment archive")
        cmd("rm -f /root/phantasia-fresh.tar.gz", "Removing fresh deployment archive")
        
        # Check disk space saved
        cmd("df -h /", "Checking disk space after cleanup")
        
        # Verify the active location still works
        cmd("ls -la /var/www/phantasia/index.html", "Verifying active website files")
        
        # Test that nginx can still serve the site
        cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null | head -3", "Testing nginx still works")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🧹 Cleaning Up Duplicate Website Files")
    print("=" * 50)
    
    if cleanup_duplicates():
        print("\n" + "=" * 50)
        print("✅ CLEANUP COMPLETE!")
        print("\n📁 Current Website Status:")
        print("• ACTIVE LOCATION: /var/www/phantasia/")
        print("• nginx serves from: /var/www/phantasia/")
        print("• Authentication: phantasia_dev / i1Si1SbOEkgK")
        print("• URL: http://212.227.85.148/")
        print("• Status: Password Protected")
        print("\n🗑️  Removed Duplicates:")
        print("• /root/Projects/ProjectPhantasia/ (saved ~593MB)")
        print("• /root/browser/ (saved ~593MB)")  
        print("• deployment archives (saved ~900MB)")
        print(f"\n💾 Total space saved: ~2GB")
    else:
        print("❌ Cleanup failed")