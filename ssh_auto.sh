#!/bin/bash

# Automated SSH Connection with Password
# Usage: ./ssh_auto.sh "command to run"
# Example: ./ssh_auto.sh "ls -la"

SERVER_IP="212.227.85.148"
SERVER_USER="root"
SERVER_PASSWORD="KC361kLC"

COMMAND="${1:-bash}"

echo "🔐 Connecting to $SERVER_USER@$SERVER_IP with automated password..."

expect << EXPECTEOF
set timeout 60
spawn ssh -o StrictHostKeyChecking=no $SERVER_USER@$SERVER_IP

expect "*password*" {
    send "$SERVER_PASSWORD\r"
}

expect "*#*" {
    send "$COMMAND\r"

    if {"$COMMAND" == "bash"} {
        interact
    } else {
        expect "*#*"
        send "exit\r"
    }
}

expect eof
EXPECTEOF