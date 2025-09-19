# 🎭 Phantasia Complete Deployment Scripts

## 🚀 Quick Start (One Command Deployment)

```bash
./deploy_phantasia_complete.sh
```

This master script will run everything automatically in the correct order.

## 📋 What Gets Deployed

### ✅ Server Infrastructure
- **Ubuntu 24.04.3 LTS** with all updates
- **Nginx 1.24.0** web server with optimized configuration
- **UFW Firewall** (ports 22, 80, 443 open)
- **Let's Encrypt SSL** certificates with auto-renewal

### ✅ Website Features
- **Angular Production Build** (latest code)
- **SPA Routing** (try_files configuration)
- **Gzip Compression** for all static assets
- **Caching Headers** (1 year for static files)
- **Security Headers** (XSS protection, frame options, etc.)

### ✅ Database Integration
- **GelDB v7.9.0** database system
- **REST API Server** (Node.js on port 3000)
- **Database Schema** (artists, albums, tracks, collections, twitter)
- **API Endpoints** (/api/health, /api/artists, /api/albums)
- **CORS Configuration** for Angular integration

### ✅ Domain Configuration
- **Primary Domain**: deeptesting.prismaticcollections.com
- **HTTP & HTTPS** support
- **Automatic HTTPS redirect** (when SSL configured)
- **Cloudflare Integration** compatible

## 📁 Script Files

### 🎯 Main Deployment Scripts
- `deploy_phantasia_complete.sh` - **Master script (run this)**
- `complete_server_setup.sh` - Server infrastructure setup
- `deploy_website.sh` - Angular website deployment
- `setup_geldb_integration.sh` - Database integration
- `setup_ssl.sh` - SSL/HTTPS configuration
- `test_deployment.sh` - Complete testing suite

### 🛠️ Individual Component Scripts
- `check_server_status.sh` - Server diagnostics
- `fix_server_nginx.sh` - Nginx troubleshooting
- `test_ssh_auth.sh` - SSH connection testing

## 🔐 Server Details

```
Server: root@212.227.85.148
Password: KC361kLC
Domain: deeptesting.prismaticcollections.com
Web Root: /var/www/phantasia/
API Port: 3000
```

## 📊 API Endpoints

```
Health Check: http://212.227.85.148/api/health
Artists:      http://212.227.85.148/api/artists
Albums:       http://212.227.85.148/api/albums
Twitter:      http://212.227.85.148/api/twitter/users
```

## 🧪 Testing

The deployment includes comprehensive testing:
- ✅ **Connectivity Tests** (SSH, HTTP, HTTPS)
- ✅ **Service Tests** (Nginx, GelDB API)
- ✅ **Website Tests** (Angular app, static assets)
- ✅ **Database Tests** (API endpoints, CORS)
- ✅ **Security Tests** (Firewall, SSL, headers)
- ✅ **Performance Tests** (Response time, compression)

## 🔧 Manual Steps (if needed)

### If running individual scripts:
```bash
# 1. Server setup
./complete_server_setup.sh

# 2. Deploy website
./deploy_website.sh

# 3. Setup database
./setup_geldb_integration.sh

# 4. Configure SSL
./setup_ssl.sh

# 5. Test everything
./test_deployment.sh
```

### DNS Configuration
Point your domain to the server:
```
A Record: deeptesting.prismaticcollections.com → 212.227.85.148
```

### SSL Certificate (if domain issues)
```bash
# SSH to server and run:
certbot --nginx -d deeptesting.prismaticcollections.com
```

## 🎯 Final URLs

After successful deployment:
- **Direct IP**: http://212.227.85.148
- **Domain HTTP**: http://deeptesting.prismaticcollections.com
- **Domain HTTPS**: https://deeptesting.prismaticcollections.com

## 🛠️ Troubleshooting

### Common Issues
1. **Domain not accessible**: Check DNS settings
2. **SSL certificate failed**: Ensure domain points to server
3. **API not working**: Check `systemctl status geldb-api`
4. **Website not loading**: Check `systemctl status nginx`

### Useful Commands
```bash
# Check all services
systemctl status nginx geldb-api

# View logs
tail -f /var/log/nginx/error.log
journalctl -u geldb-api -f

# Restart services
systemctl restart nginx geldb-api

# Test nginx config
nginx -t

# Manual SSL setup
certbot --nginx -d deeptesting.prismaticcollections.com
```

## 📈 What's Included

### Angular Website Features
- ✅ **Production Build** (optimized bundles)
- ✅ **3D Graphics Support** (Three.js integration)
- ✅ **Audio System** (Howler.js)
- ✅ **Responsive Design** (mobile/desktop)
- ✅ **Artist Database** integration
- ✅ **Social Media** features

### Server Optimizations
- ✅ **Gzip Compression** (reduces bandwidth)
- ✅ **Static File Caching** (1 year expiry)
- ✅ **Security Headers** (XSS, clickjacking protection)
- ✅ **API Proxy** (seamless backend integration)
- ✅ **Error Handling** (404 → index.html for SPA)

### Database Features
- ✅ **Artist Management** (profiles, social links)
- ✅ **Music Catalog** (albums, tracks)
- ✅ **Collection System** (playlists, compilations)
- ✅ **Twitter Integration** (cached tweets, users)
- ✅ **REST API** (JSON responses)

## 🎉 Success Criteria

Deployment is successful when:
- ✅ Website loads at both IP and domain
- ✅ Angular app renders correctly
- ✅ API endpoints return data
- ✅ SSL certificates are valid
- ✅ All tests pass

---

**🎭 Ready to deploy? Run: `./deploy_phantasia_complete.sh`**