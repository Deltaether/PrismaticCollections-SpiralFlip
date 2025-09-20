#!/bin/bash

# GelDB Deployment Script
# Based on official GelDB documentation at docs.geldata.com
# This script sets up GelDB on Ubuntu servers and imports existing database

set -euo pipefail

# Configuration
GELDB_DATA_DIR="/var/lib/geldb"
GELDB_SERVICE_DIR="/etc/systemd/system"
GELDB_USER="geldb"
GELDB_PORT="${GELDB_PORT:-5656}"
GELDB_PASSWORD="${GELDB_PASSWORD:-secure_gel_password_2024}"
DEPLOYMENT_ARCHIVE="geldb-deployment.tar.gz"
WORK_DIR="/tmp/geldb-setup"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
check_root() {
    if [[ $EUID -eq 0 ]]; then
        log_info "Running as root - continuing with GelDB deployment..."
    fi
}

# Check if deployment archive exists
check_deployment_archive() {
    if [[ ! -f "$DEPLOYMENT_ARCHIVE" ]]; then
        log_error "Deployment archive '$DEPLOYMENT_ARCHIVE' not found in current directory."
        log_info "Please ensure you have the geldb-deployment.tar.gz file in the same directory as this script."
        exit 1
    fi
    log_success "Found deployment archive: $DEPLOYMENT_ARCHIVE"
}

# Install required dependencies
install_dependencies() {
    log_info "Installing required dependencies..."

    sudo apt update
    sudo apt install -y curl wget ca-certificates gnupg lsb-release

    # Install Docker if not present
    if ! command -v docker &> /dev/null; then
        log_info "Installing Docker..."
        curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
        echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
        sudo apt update
        sudo apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
        sudo usermod -aG docker $USER
        log_success "Docker installed successfully"
    else
        log_success "Docker already installed"
    fi
}

# Install GelDB CLI
install_geldb_cli() {
    log_info "Installing GelDB CLI..."

    # Using official bash installer from docs.geldata.com
    curl https://www.geldata.com/sh --proto "=https" -sSf1 | sh

    # Add to PATH if not already there
    if ! command -v gel &> /dev/null; then
        echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
        export PATH="$HOME/.local/bin:$PATH"
    fi

    log_success "GelDB CLI installed successfully"
    gel --version
}

# Create GelDB user and directories
setup_geldb_user() {
    log_info "Setting up GelDB user and directories..."

    # Create geldb user if it doesn't exist
    if ! id "$GELDB_USER" &>/dev/null; then
        sudo useradd --system --shell /bin/false --home-dir "$GELDB_DATA_DIR" --create-home "$GELDB_USER"
        log_success "Created GelDB user: $GELDB_USER"
    else
        log_success "GelDB user already exists"
    fi

    # Create data directory with proper permissions
    sudo mkdir -p "$GELDB_DATA_DIR"
    sudo chown -R "$GELDB_USER:$GELDB_USER" "$GELDB_DATA_DIR"
    sudo chmod 755 "$GELDB_DATA_DIR"

    log_success "GelDB directories configured"
}

# Extract and setup database files
setup_database_files() {
    log_info "Setting up database files..."

    # Create work directory
    mkdir -p "$WORK_DIR"
    cd "$WORK_DIR"

    # Extract deployment archive
    tar -xzf "$PWD/../$DEPLOYMENT_ARCHIVE"

    # Copy database files to proper location
    sudo cp -r geldb/* "$GELDB_DATA_DIR/"
    sudo chown -R "$GELDB_USER:$GELDB_USER" "$GELDB_DATA_DIR"

    log_success "Database files extracted and configured"
}

# Install GelDB server using CLI
install_geldb_server() {
    log_info "Installing GelDB server..."

    # Install the server version specified in gel.toml
    gel server install

    log_success "GelDB server installed"
}

# Create systemd service for GelDB
create_systemd_service() {
    log_info "Creating systemd service for GelDB..."

    sudo tee "$GELDB_SERVICE_DIR/geldb.service" > /dev/null <<EOF
[Unit]
Description=GelDB Database Server
Documentation=https://docs.geldata.com
After=network.target
Wants=network.target

[Service]
Type=notify
User=$GELDB_USER
Group=$GELDB_USER
WorkingDirectory=$GELDB_DATA_DIR
Environment=GEL_SERVER_PASSWORD=$GELDB_PASSWORD
Environment=GEL_SERVER_PORT=$GELDB_PORT
ExecStart=/home/$USER/.local/bin/gel server start --bind-address=0.0.0.0 --port=$GELDB_PORT
ExecReload=/bin/kill -HUP \$MAINPID
KillMode=mixed
KillSignal=SIGINT
TimeoutStopSec=30
Restart=on-failure
RestartSec=5
LimitNOFILE=65536

# Security settings
NoNewPrivileges=true
ProtectSystem=strict
ProtectHome=true
ReadWritePaths=$GELDB_DATA_DIR
PrivateTmp=true
PrivateDevices=true
ProtectKernelTunables=true
ProtectKernelModules=true
ProtectControlGroups=true

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd and enable service
    sudo systemctl daemon-reload
    sudo systemctl enable geldb.service

    log_success "Systemd service created and enabled"
}

# Setup Docker-based GelDB (alternative deployment method)
setup_docker_geldb() {
    log_info "Setting up Docker-based GelDB deployment..."

    # Create docker-compose.yml
    sudo tee "$GELDB_DATA_DIR/docker-compose.yml" > /dev/null <<EOF
version: '3.8'

services:
  geldb:
    image: geldata/gel:latest
    container_name: geldb-server
    restart: unless-stopped
    environment:
      - GEL_SERVER_PASSWORD=$GELDB_PASSWORD
      - GEL_SERVER_PORT=$GELDB_PORT
    volumes:
      - $GELDB_DATA_DIR/data:/var/lib/gel/data
      - $GELDB_DATA_DIR/dbschema:/dbschema
    ports:
      - "$GELDB_PORT:$GELDB_PORT"
    user: "1000:1000"

    # Resource limits (minimum 1GB RAM as per docs.geldata.com)
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G
EOF

    # Create systemd service for Docker Compose
    sudo tee "$GELDB_SERVICE_DIR/geldb-docker.service" > /dev/null <<EOF
[Unit]
Description=GelDB Docker Container
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=$GELDB_DATA_DIR
ExecStart=/usr/bin/docker compose up -d
ExecStop=/usr/bin/docker compose down
TimeoutStartSec=0

[Install]
WantedBy=multi-user.target
EOF

    sudo systemctl daemon-reload
    sudo systemctl enable geldb-docker.service

    log_success "Docker-based GelDB service configured"
}

# Import/restore database data
restore_database() {
    log_info "Checking for database backup files to restore..."

    cd "$GELDB_DATA_DIR"

    # Look for .esdl schema files
    if [[ -f "dbschema/default.esdl" ]]; then
        log_info "Found schema file, applying migrations..."
        sudo -u "$GELDB_USER" gel migration create --non-interactive
        sudo -u "$GELDB_USER" gel migrate
        log_success "Schema migrations applied"
    fi

    # Look for data files to import
    if [[ -f "phantasia2-artists-data.edgeql" ]]; then
        log_info "Found data file: phantasia2-artists-data.edgeql"
        sudo -u "$GELDB_USER" gel query --file phantasia2-artists-data.edgeql
        log_success "Artists data imported"
    fi

    if [[ -f "phantasia2-complete-credits.edgeql" ]]; then
        log_info "Found data file: phantasia2-complete-credits.edgeql"
        sudo -u "$GELDB_USER" gel query --file phantasia2-complete-credits.edgeql
        log_success "Credits data imported"
    fi
}

# Start GelDB service
start_geldb_service() {
    log_info "Starting GelDB service..."

    # Choose deployment method based on available options
    if systemctl is-enabled geldb.service &>/dev/null; then
        sudo systemctl start geldb.service
        sudo systemctl status geldb.service --no-pager
    elif systemctl is-enabled geldb-docker.service &>/dev/null; then
        sudo systemctl start geldb-docker.service
        sudo systemctl status geldb-docker.service --no-pager
    else
        log_error "No GelDB service found to start"
        return 1
    fi

    log_success "GelDB service started"
}

# Verify installation
verify_installation() {
    log_info "Verifying GelDB installation..."

    # Wait for service to start
    sleep 10

    # Test connection
    if gel instance status; then
        log_success "GelDB is running and accessible"

        # Show instance info
        gel instance info

        # Test basic query
        echo "SELECT 1;" | gel query || log_warning "Could not execute test query"

    else
        log_error "GelDB service verification failed"
        return 1
    fi
}

# Cleanup
cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "$WORK_DIR"
    log_success "Cleanup completed"
}

# Main deployment function
main() {
    log_info "Starting GelDB deployment process..."
    log_info "Using official procedures from docs.geldata.com"

    check_root
    check_deployment_archive

    install_dependencies
    install_geldb_cli
    install_geldb_server
    setup_geldb_user
    setup_database_files

    # Choose deployment method
    echo
    log_info "Choose deployment method:"
    echo "1) Native GelDB server (recommended)"
    echo "2) Docker-based deployment"
    read -p "Enter choice [1-2]: " deployment_choice

    case $deployment_choice in
        1)
            create_systemd_service
            ;;
        2)
            setup_docker_geldb
            ;;
        *)
            log_warning "Invalid choice, defaulting to native deployment"
            create_systemd_service
            ;;
    esac

    start_geldb_service
    restore_database
    verify_installation
    cleanup

    log_success "GelDB deployment completed successfully!"
    echo
    log_info "GelDB is now running on port $GELDB_PORT"
    log_info "Instance name: twitter-feedback-python"
    log_info "You can connect using: gel --port $GELDB_PORT"
    echo
    log_info "To manage the service:"
    log_info "  Start:   sudo systemctl start geldb"
    log_info "  Stop:    sudo systemctl stop geldb"
    log_info "  Status:  sudo systemctl status geldb"
    log_info "  Logs:    sudo journalctl -u geldb -f"
}

# Script entry point
main "$@"