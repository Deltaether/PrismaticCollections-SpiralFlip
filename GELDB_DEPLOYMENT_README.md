# GelDB Deployment Guide

This guide provides instructions for deploying GelDB on a remote Ubuntu server using the official procedures from docs.geldata.com.

## Files Created

1. **geldb-deployment.tar.gz** - Archive containing your GelDB database
2. **deploy_geldb.sh** - Deployment script following official GelDB practices
3. **GELDB_DEPLOYMENT_README.md** - This documentation file

## Pre-deployment Setup

The deployment archive has been created from your local GelDB directory at:
`/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/src/geldb`

## Deployment Instructions

### Step 1: Transfer Files to Server

Copy both the archive and script to your Ubuntu server:

```bash
# Copy files to server
scp geldb-deployment.tar.gz deploy_geldb.sh user@your-server:/home/user/

# SSH to server
ssh user@your-server
```

### Step 2: Run Deployment Script

Execute the deployment script on the server:

```bash
# Make script executable (if not already)
chmod +x deploy_geldb.sh

# Run deployment (requires sudo privileges)
./deploy_geldb.sh
```

### Step 3: Choose Deployment Method

The script will prompt you to choose between:

1. **Native GelDB server** (recommended) - Direct server installation
2. **Docker-based deployment** - Containerized deployment

Both methods follow official GelDB documentation standards.

## What the Script Does

### 1. System Preparation
- Installs required dependencies (curl, wget, ca-certificates)
- Installs Docker (if choosing Docker deployment)
- Creates dedicated `geldb` system user

### 2. GelDB Installation
- Installs GelDB CLI using official installer: `curl https://www.geldata.com/sh --proto "=https" -sSf1 | sh`
- Installs GelDB server using `gel server install`
- Sets up proper directory structure at `/var/lib/geldb`

### 3. Database Setup
- Extracts your database files to proper locations
- Applies schema migrations from `dbschema/default.esdl`
- Imports data from `.edgeql` files if present

### 4. Service Configuration
- Creates systemd service for automatic startup
- Configures proper security settings
- Sets up resource limits (minimum 1GB RAM as per docs.geldata.com)

### 5. Data Restoration
- Applies database schema migrations
- Imports data files:
  - `phantasia2-artists-data.edgeql`
  - `phantasia2-complete-credits.edgeql`

## Post-Deployment

### Connection Information
- **Port**: 5656 (default)
- **Instance Name**: twitter-feedback-python
- **Data Directory**: `/var/lib/geldb`

### Service Management
```bash
# Start service
sudo systemctl start geldb

# Stop service
sudo systemctl stop geldb

# Check status
sudo systemctl status geldb

# View logs
sudo journalctl -u geldb -f
```

### GelDB CLI Usage
```bash
# Check instance status
gel instance status

# Connect to database
gel --port 5656

# Execute queries
gel query "SELECT 1;"

# Create backup
gel dump backup.geldb
```

## Configuration

### Environment Variables
The deployment uses these default settings:

- `GEL_SERVER_PASSWORD`: secure_gel_password_2024
- `GEL_SERVER_PORT`: 5656
- `GELDB_DATA_DIR`: /var/lib/geldb

### Customization
You can modify these settings by editing the script variables at the top of `deploy_geldb.sh`:

```bash
GELDB_PORT="${GELDB_PORT:-5656}"
GELDB_PASSWORD="${GELDB_PASSWORD:-secure_gel_password_2024}"
```

## Security Considerations

### Service Security
The systemd service includes security hardening:
- Runs as dedicated `geldb` user
- No new privileges
- Protected system and home directories
- Private temporary directory
- Limited file access

### Network Security
- Configure firewall rules for port 5656
- Consider using reverse proxy for production
- Enable TLS for production deployments

## Troubleshooting

### Common Issues

1. **Memory Requirements**
   - GelDB requires minimum 1GB RAM
   - Monitor with: `free -h`

2. **Permission Errors**
   - Ensure files are owned by `geldb` user
   - Check: `sudo ls -la /var/lib/geldb`

3. **Service Startup Issues**
   - Check logs: `sudo journalctl -u geldb`
   - Verify configuration: `gel instance info`

4. **Connection Problems**
   - Verify port is open: `sudo netstat -tlnp | grep 5656`
   - Check firewall: `sudo ufw status`

### Log Locations
- Service logs: `sudo journalctl -u geldb`
- GelDB logs: `/var/lib/geldb/logs/` (if configured)

## Backup and Maintenance

### Creating Backups
```bash
# Create full backup
gel dump --all /backup/geldb-$(date +%Y%m%d)

# Create branch backup
gel dump /backup/geldb-branch-$(date +%Y%m%d).geldb
```

### Restoration
```bash
# Restore from backup
gel restore /path/to/backup.geldb
```

## Support

For issues related to GelDB itself, refer to:
- Official documentation: https://docs.geldata.com
- CLI reference: https://docs.geldata.com/cli
- Deployment guides: https://docs.geldata.com/guides/deployment

This deployment script follows all official GelDB best practices and procedures as documented at docs.geldata.com.