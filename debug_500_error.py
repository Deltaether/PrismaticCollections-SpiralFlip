#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def debug_500_error():
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
            
            return stdout.channel.recv_exit_status() == 0

        # Check detailed nginx error logs
        cmd("tail -20 /var/log/nginx/error.log", "Latest nginx error log entries")
        
        # Check if the web directory and files exist
        cmd("ls -la /var/www/phantasia/", "Web directory contents")
        cmd("ls -la /var/www/phantasia/index.html", "Check index.html specifically")
        
        # Check file permissions
        cmd("namei -l /var/www/phantasia/index.html", "Check full path permissions")
        
        # Check nginx worker process user
        cmd("ps aux | grep nginx", "Check nginx processes")
        
        # Try to access the file as www-data user
        cmd("sudo -u www-data cat /var/www/phantasia/index.html | head -3", "Test file access as www-data")
        
        # Check if there are any SELinux issues (if applicable)
        cmd("getenforce 2>/dev/null || echo 'SELinux not installed'", "Check SELinux status")
        
        # Create a minimal test nginx config without auth
        print("\n🔧 Creating minimal test config...")
        minimal_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    error_log /var/log/nginx/error.log debug;
    access_log /var/log/nginx/access.log;
}'''
        
        # Write minimal config
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{minimal_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        # Test and reload
        if cmd("nginx -t", "Test minimal config"):
            if cmd("systemctl reload nginx", "Reload nginx"):
                import time
                time.sleep(2)
                
                # Test minimal config
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Test minimal config")
                
                # Check new error logs
                cmd("tail -5 /var/log/nginx/error.log", "Check for new errors")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔍 Debugging 500 Internal Server Error")
    print("=" * 50)
    debug_500_error()