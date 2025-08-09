#!/usr/bin/env python3

import paramiko
import sys

# Server details
SERVER_IP = "212.227.85.148"
USERNAME = "root"
PASSWORD = "16nFuBcg"
PORT = 22

def test_ssh():
    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        
        print(f"Connecting to {USERNAME}@{SERVER_IP}:{PORT}...")
        ssh.connect(SERVER_IP, port=PORT, username=USERNAME, password=PASSWORD, timeout=10)
        print("✅ SSH connection successful!")
        
        # Test a simple command
        stdin, stdout, stderr = ssh.exec_command("echo 'Connection test successful'; pwd; ls -la /root/")
        output = stdout.read().decode().strip()
        error = stderr.read().decode().strip()
        
        if output:
            print(f"Output: {output}")
        if error:
            print(f"Error: {error}")
            
        ssh.close()
        return True
        
    except Exception as e:
        print(f"Connection failed: {str(e)}")
        return False

if __name__ == "__main__":
    test_ssh()