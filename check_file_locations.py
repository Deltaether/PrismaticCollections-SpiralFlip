#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def check_file_locations():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command, desc=""):
            if desc:
                print(f"\n🔍 {desc}")
            print(f"$ {command}")
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error:
                print(f"Error: {error}")
            
            return output

        # Check nginx configuration to see what path it's using
        print("🔍 Checking current nginx configuration:")
        cmd("grep -n 'root' /etc/nginx/sites-available/default")
        
        # Check what's in /root/Projects/ProjectPhantasia
        cmd("ls -la /root/Projects/ProjectPhantasia/", "Contents of /root/Projects/ProjectPhantasia/")
        
        # Check what's in /var/www/phantasia
        cmd("ls -la /var/www/phantasia/", "Contents of /var/www/phantasia/")
        
        # Check what's in root directory
        cmd("ls -la /root/ | grep -E '(index|browser|phantasia|chunk)'", "Website files in /root/")
        
        # Find all index.html files
        cmd("find /root -name 'index.html' -type f 2>/dev/null", "All index.html locations")
        
        # Check disk usage of different directories
        cmd("du -sh /root/Projects/ProjectPhantasia/ /var/www/phantasia/ /root/browser 2>/dev/null", "Disk usage of directories")
        
        # Check which directory nginx is actually serving from
        print("\n📋 Current nginx status:")
        cmd("systemctl status nginx --no-pager -l | head -5")
        
        ssh.close()
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    print("🔍 Checking Website File Locations")
    print("=" * 50)
    check_file_locations()
    
    print("\n" + "=" * 50)
    print("📋 SUMMARY:")
    print("Based on the output above:")
    print("• nginx is configured to serve from: [check root directive above]")
    print("• Website files exist in multiple locations (duplicates)")
    print("• We should clean up and use only one location")