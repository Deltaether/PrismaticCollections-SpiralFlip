# DNS Setup Guide for prismaticcollections.com

## ✅ Server Setup Complete

The nginx configuration for `prismaticcollections.com` has been successfully installed on server `216.225.206.85`.

## 🌐 Current Active Configurations

1. **IP Access**: `216.225.206.85` (working with HTTPS)
2. **Main Domain**: `prismaticcollections.com` (ready, needs DNS)
3. **WWW Redirect**: `www.prismaticcollections.com` → `prismaticcollections.com`

## 📋 DNS Configuration Required

### In Cloudflare Dashboard:

1. **A Record for Main Domain:**
   ```
   Type: A
   Name: prismaticcollections.com (or @)
   Value: 216.225.206.85
   Proxy: ☁️ Enabled (Orange Cloud)
   ```

2. **A Record for WWW:**
   ```
   Type: A
   Name: www
   Value: 216.225.206.85
   Proxy: ☁️ Enabled (Orange Cloud)
   ```

### Alternative CNAME Setup (if preferred):
```
Type: CNAME
Name: www
Value: prismaticcollections.com
Proxy: ☁️ Enabled (Orange Cloud)
```

## 🔒 SSL Configuration

- **Certificates**: Cloudflare Origin certificates already installed
- **Encryption**: Full (strict) - between Cloudflare and origin server
- **Security**: HSTS, security headers, and CSP configured

## 🧪 Testing After DNS Propagation

1. **Main Domain**: https://prismaticcollections.com
2. **WWW Redirect**: https://www.prismaticcollections.com (should redirect to main)
3. **HTTP Redirect**: http://prismaticcollections.com (should redirect to HTTPS)

## ⚡ Features Enabled

- ✅ Angular SPA routing support
- ✅ API proxy to GelDB backend (`/api/*`)
- ✅ Static asset caching (1 year)
- ✅ Gzip compression
- ✅ Security headers
- ✅ CORS for 3D and audio assets
- ✅ Pre-compressed gzip files support

## 🔧 Server Files

- **Config**: `/etc/nginx/sites-available/prismaticcollections.com`
- **Enabled**: `/etc/nginx/sites-enabled/prismaticcollections.com`
- **Website**: `/var/www/phantasia/`
- **SSL Certs**: `/etc/ssl/certs/Cloudflare_Origin_TLS*`

## 📊 Performance Optimizations

- **HTTP/2** enabled
- **Gzip compression** for all text assets
- **Static caching** with immutable headers
- **CDN-friendly** configuration
- **Pre-compressed** files support

## 🚨 Important Notes

1. **DNS Propagation**: May take 5-60 minutes globally
2. **Cloudflare Proxy**: Must be enabled (orange cloud) for SSL to work
3. **Origin Certificates**: Valid until 2040
4. **API Endpoint**: All `/api/` requests proxy to localhost:3000

## 🔄 Maintenance Scripts

- **Deploy Updates**: `./deploy_optimized.sh`
- **Main Domain Setup**: `./setup_main_domain.sh` (completed)
- **Build & Deploy**: `pnpm run build:deploy`

---

**Status**: ✅ Server configuration complete, waiting for DNS configuration