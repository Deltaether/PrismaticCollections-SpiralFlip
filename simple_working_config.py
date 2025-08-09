#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def create_simple_working_config():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command):
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            error = stderr.read().decode().strip()
            
            if output:
                print(output)
            if error and "warning" not in error.lower():
                print(f"Error: {error}")
            
            return stdout.channel.recv_exit_status() == 0

        print("🔧 Creating absolutely minimal working config...")
        
        # Step 1: Create a super simple config without authentication first
        simple_working_config = '''server {
    listen 80;
    server_name _;
    root /var/www/phantasia;
    index index.html;
    
    location / {
        return 301 https://example.com;
    }
}'''
        
        # Write and test a redirect first to make sure basic config works
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{simple_working_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        print("Testing redirect config...")
        cmd("nginx -t")
        cmd("systemctl reload nginx")
        cmd("curl -I http://localhost/ 2>/dev/null | head -3")
        
        # Step 2: If that works, try serving a simple HTML file
        print("\n🔧 Creating config to serve static files...")
        static_config = '''server {
    listen 80;
    server_name _;
    root /var/www/phantasia;
    index index.html;
    
    location / {
        # Just serve the file directly, no try_files
        if (!-f $request_filename) {
            return 404;
        }
    }
}'''
        
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{static_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        print("Testing static file serving...")
        cmd("nginx -t")
        cmd("systemctl reload nginx")
        cmd("curl -I http://localhost/ 2>/dev/null | head -3")
        
        # Step 3: If that works, add Angular routing support
        print("\n🔧 Adding Angular routing support...")
        angular_config = '''server {
    listen 80;
    server_name _;
    root /var/www/phantasia;
    index index.html;
    
    # Serve existing files directly
    location / {
        # First serve request as file, then as directory, then fallback to index.html
        try_files $uri $uri/ /index.html;
    }
    
    # Explicit rule for index.html to avoid loops
    location = /index.html {
        # Break any potential loops
        break;
    }
}'''
        
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{angular_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        print("Testing Angular routing config...")
        cmd("nginx -t")
        cmd("systemctl reload nginx")
        cmd("curl -I http://localhost/ 2>/dev/null | head -3")
        cmd("curl -s http://localhost/ | head -3")
        
        # Step 4: If that works, add authentication
        print("\n🔧 Adding authentication...")
        final_config = '''server {
    listen 80;
    server_name _;
    root /var/www/phantasia;
    index index.html;
    
    # Basic Authentication
    auth_basic "Phantasia Testing";
    auth_basic_user_file /etc/nginx/.htpasswd;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location = /index.html {
        # Prevent redirect loops
        break;
    }
}'''
        
        stdin, stdout, stderr = ssh.exec_command(f"cat > /etc/nginx/sites-available/default << 'EOF'\n{final_config}\nEOF")
        stdout.channel.recv_exit_status()
        
        print("Testing final config with authentication...")
        cmd("nginx -t")
        cmd("systemctl reload nginx")
        cmd("curl -I http://localhost/ 2>/dev/null | head -3")
        cmd("curl -I -u phantasia_dev:i1Si1SbOEkgK http://localhost/ 2>/dev/null | head -3")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    print("🔧 Creating Simple Working nginx Config")
    print("=" * 45)
    create_simple_working_config()
    
    # Final test
    print(f"\n🧪 Final test:")
    print(f"Try visiting: http://{SERVER_IP}/")
    print(f"Username: phantasia_dev")
    print(f"Password: i1Si1SbOEkgK")