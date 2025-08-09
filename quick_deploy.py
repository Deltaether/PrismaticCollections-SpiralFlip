#!/usr/bin/env python3

import paramiko

SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def quick_deploy():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ Connected to server")
        
        def cmd(command):
            stdin, stdout, stderr = ssh.exec_command(command)
            output = stdout.read().decode().strip()
            if output:
                print(output)
            return stdout.channel.recv_exit_status() == 0

        # Upload file
        print("📤 Uploading...")
        sftp = ssh.open_sftp()
        sftp.put("phantasia-auth.tar.gz", "/root/phantasia-auth.tar.gz")
        sftp.close()
        print("✅ Uploaded!")
        
        # Deploy
        print("🔧 Deploying...")
        cmd("rm -rf /var/www/phantasia/*")
        cmd("cd /var/www/phantasia && tar -xzf /root/phantasia-auth.tar.gz")
        cmd("chown -R www-data:www-data /var/www/phantasia")
        cmd("rm /root/phantasia-auth.tar.gz")
        
        # Test
        print("🧪 Testing...")
        cmd("curl -s http://localhost/ | head -5")
        
        ssh.close()
        return True
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    quick_deploy()
    print(f"\n🌐 Test at: http://{SERVER_IP}/")
    print(f"👤 Username: phantasia_dev")
    print(f"🔑 Password: i1Si1SbOEkgK")