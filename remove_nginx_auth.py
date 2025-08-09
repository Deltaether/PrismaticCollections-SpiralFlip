#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def remove_nginx_auth():
    try:
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

        # Create simple nginx config without authentication
        simple_nginx_config = '''server {
    listen 80 default_server;
    listen [::]:80 default_server;
    
    root /var/www/phantasia;
    index index.html;
    server_name _;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|glb|mp3|mp4)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}'''
        
        print("🔧 Removing nginx authentication and creating simple config...")
        
        # Write simple config without auth
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{simple_nginx_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        # Remove the password file
        cmd("rm -f /etc/nginx/.htpasswd", "Removing nginx password file")
        
        # Test and reload nginx
        if cmd("nginx -t", "Testing nginx configuration"):
            if cmd("systemctl reload nginx", "Reloading nginx"):
                print("✅ nginx reloaded without authentication!")
                
                import time
                time.sleep(2)
                
                # Test that it works without auth now
                cmd("curl -I http://localhost/ 2>/dev/null | head -3", "Testing website without auth")
                cmd("curl -s http://localhost/ | head -5", "Getting website content")
                
                ssh.close()
                return True
        
        ssh.close()
        return False
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Removing nginx Authentication")
    print("=" * 40)
    
    if remove_nginx_auth():
        print("\n✅ nginx authentication removed!")
        print("🌐 Website should now be accessible without login at:")
        print("   http://212.227.85.148/")
        print("\n📝 Next: Adding Angular authentication...")
    else:
        print("❌ Failed to remove nginx authentication")