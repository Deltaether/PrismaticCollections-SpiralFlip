# Project Phantasia Web Deployment Guide

## Server Status
- ✅ **Server Online**: http://212.227.85.148
- ✅ **Nginx Running**: nginx/1.24.0 (Ubuntu)  
- ❌ **SSH Access**: Not available on standard ports
- ✅ **HTTP/HTTPS**: Ports 80 and 443 are open

## Current Situation
The server is online with nginx already installed and running, but SSH access is not available on the standard port 22 or common alternatives. This means we need alternative deployment methods.

## Deployment Options

### Option 1: Web Panel/Control Panel Access
Many VPS providers offer web-based file management panels:
- **cPanel/Plesk**: Look for file manager
- **Provider Dashboard**: Check your VPS provider's control panel
- **Web File Manager**: Some providers have built-in file managers

### Option 2: SFTP/FTP Access
Try these if SSH is not available:
```bash
# Try SFTP (usually same credentials as SSH)
sftp -P 21 root@212.227.85.148
sftp -P 22 root@212.227.85.148

# Try FTP
ftp 212.227.85.148
```

### Option 3: Alternative SSH Ports
Contact your VPS provider to:
1. Enable SSH service
2. Get the correct SSH port
3. Configure firewall rules

## Files Ready for Deployment

### 1. Application Files
- **Location**: `dist/phantasia/` (built Angular app)
- **Size**: ~587MB compressed
- **Target**: `/var/www/html/` or nginx document root

### 2. Nginx Configuration
The server needs this nginx config for Angular routing:

```nginx
server {
    listen 80;
    server_name _;
    
    root /var/www/html;
    index index.html;
    
    # Handle Angular routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Angular routes
    location ~ ^/(phantasia|collections|home|disc-1|disc-2|pv|information|mobile) {
        try_files $uri $uri/ /index.html;
    }
    
    # Static assets with caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        try_files $uri =404;
    }
}
```

## Manual Deployment Steps

### Step 1: Get Server Access
1. Contact your VPS/hosting provider
2. Request SSH access or get correct SSH port
3. Alternative: Use web-based file manager

### Step 2: Upload Files
1. Extract `phantasia-deploy.tar.gz` 
2. Upload contents to `/var/www/html/` or nginx document root
3. Set proper permissions: `chown -R www-data:www-data /var/www/html/`

### Step 3: Configure Nginx
1. Replace default nginx config with Angular-friendly config above
2. Test configuration: `nginx -t`
3. Restart nginx: `systemctl restart nginx`

### Step 4: Verify Deployment
- Visit: http://212.227.85.148/
- Test Angular routing: http://212.227.85.148/phantasia
- Check collections: http://212.227.85.148/collections

## Current Status
- ✅ **Angular app built and ready**
- ✅ **Deployment package created** 
- ✅ **Server is online with nginx**
- ⏳ **Waiting for SSH/file upload access**

## Next Steps
1. **Get server access** (SSH, SFTP, or web panel)
2. **Upload and extract** `phantasia-deploy.tar.gz`
3. **Configure nginx** with provided config
4. **Test the deployed application**

---
**Server Details**:
- IP: 212.227.85.148
- Current: nginx default page
- Target: Project Phantasia Angular application