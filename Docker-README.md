# 🎭 Prismatic Collections - Docker Deployment Guide

This comprehensive Docker setup provides a complete multi-container architecture for the Prismatic Collections website with all components working flawlessly.

## 🏗️ Architecture Overview

The deployment consists of 5 main services:

1. **🌐 Frontend (Angular + Nginx)** - Port 80
   - Production-optimized Angular 20 build
   - Nginx reverse proxy with caching
   - Health checks and monitoring

2. **⚡ Backend API (Node.js)** - Port 3001
   - Express.js server with TypeScript
   - EdgeDB integration for Twitter data
   - CORS configuration for frontend

3. **🗄️ EdgeDB Database** - Port 5656, Admin UI: 8888
   - Graph-relational database
   - Twitter schema with Tweet/User models
   - Persistent data storage

4. **🐦 Twitter Fetcher (Python)** - Health check: Port 8080
   - Scheduled Twitter API v2 data collection
   - Automatic tweet fetching every 30 minutes
   - Flask health check endpoint

5. **📊 Monitoring Dashboard** - Port 9090
   - Real-time service health monitoring
   - Beautiful web interface
   - Service status indicators

## 🚀 Quick Start

### Prerequisites

- Docker Engine 20.0+
- Docker Compose 2.0+
- Twitter API v2 Bearer Token

### 1. Setup Twitter Bearer Token

Create your Twitter bearer token file:

```bash
echo "YOUR_TWITTER_BEARER_TOKEN" > Twitter-bearer-token
```

### 2. Deploy Everything

Run the automated deployment script:

```bash
# Make script executable
chmod +x scripts/docker-deploy.sh

# Deploy all services
./scripts/docker-deploy.sh deploy
```

### 3. Access Your Application

Once deployed, access these URLs:

- **🌐 Main Website**: http://localhost:80
- **📊 Monitoring Dashboard**: http://localhost:9090
- **⚡ API Documentation**: http://localhost:3001
- **🗄️ EdgeDB Admin**: http://localhost:8888
- **🐦 Twitter Fetcher Status**: http://localhost:8080/health

## 📂 Project Structure

```
docker/
├── frontend/
│   ├── Dockerfile                 # Angular + Nginx container
│   ├── nginx.conf                 # Main nginx configuration
│   └── default.conf               # Site-specific nginx config
├── backend/
│   └── Dockerfile                 # Node.js API container
├── python-fetcher/
│   ├── Dockerfile                 # Python Twitter fetcher
│   ├── requirements.txt           # Python dependencies
│   ├── scheduler.py               # Tweet fetching scheduler
│   └── entrypoint.py             # Enhanced fetcher script
├── edgedb/
│   └── init/
│       └── 01-init-schema.sh     # Database initialization
└── monitoring/
    ├── nginx.conf                 # Monitoring proxy config
    └── dashboard/
        └── index.html             # Health monitoring dashboard

scripts/
└── docker-deploy.sh              # Automated deployment script

docker-compose.yml                # Multi-service orchestration
.env.docker                       # Environment configuration
```

## 🛠️ Management Commands

The deployment script provides several management commands:

```bash
# Deploy everything (initial setup)
./scripts/docker-deploy.sh deploy

# Start existing services
./scripts/docker-deploy.sh start

# Stop all services
./scripts/docker-deploy.sh stop

# Restart all services
./scripts/docker-deploy.sh restart

# View logs for all services
./scripts/docker-deploy.sh logs

# Check service status and health
./scripts/docker-deploy.sh status

# Clean up everything (removes data!)
./scripts/docker-deploy.sh clean
```

## 🔧 Manual Docker Compose Commands

For advanced users, you can use Docker Compose directly:

```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d frontend

# View logs
docker-compose logs -f backend

# Scale services
docker-compose up -d --scale twitter-fetcher=2

# Stop everything
docker-compose down

# Remove everything including volumes
docker-compose down -v
```

## 🏥 Health Monitoring

All services include comprehensive health checks:

### Automatic Health Checks
- **Frontend**: HTTP check on /health endpoint
- **Backend**: API health endpoint validation
- **Twitter Fetcher**: Flask health server on port 8080
- **EdgeDB**: Database connectivity validation

### Monitoring Dashboard
Access http://localhost:9090 for a real-time dashboard showing:
- Service status indicators (green/yellow/red)
- Response times and connectivity
- Last update timestamps
- Detailed error information

### Manual Health Checks
```bash
# Check all services
curl http://localhost:9090/api/health/all

# Individual service checks
curl http://localhost:80/health          # Frontend
curl http://localhost:3001/health        # Backend
curl http://localhost:8080/health        # Twitter Fetcher
```

## 🔐 Security Features

- **Non-root containers**: All services run as non-root users
- **Secrets management**: Twitter token mounted as read-only volume
- **Network isolation**: Services communicate via dedicated Docker network
- **Nginx security headers**: XSS protection, content type sniffing prevention
- **CORS configuration**: Proper origin validation for API access

## 📊 Performance Optimizations

### Frontend (Angular + Nginx)
- Multi-stage Docker build for minimal image size
- Gzip compression for static assets
- Browser caching with appropriate headers
- CDN-ready static file serving

### Backend (Node.js)
- TypeScript compilation in container
- Health check endpoints for load balancer integration
- Graceful shutdown handling
- Memory and CPU optimization

### Database (EdgeDB)
- Persistent volume for data storage
- Optimized indexes for Twitter data queries
- Connection pooling and timeout configuration

### Twitter Fetcher (Python)
- Scheduled execution with cron-like functionality
- Rate limiting protection for Twitter API
- Automatic retry logic for failed requests
- Comprehensive logging and error handling

## 🌍 Environment Configuration

The `.env.docker` file contains all configuration options:

```bash
# Core services
EDGEDB_HOST=edgedb
BACKEND_PORT=3001
FRONTEND_PORT=80

# Twitter integration
TWITTER_USERNAME=prismcollect_
MAX_TWEETS=100
FETCH_SCHEDULE_INTERVAL=30

# Performance tuning
NODE_OPTIONS=--max-old-space-size=2048
NGINX_WORKER_PROCESSES=auto
NGINX_WORKER_CONNECTIONS=1024
```

## 🔄 Data Persistence

Data is persisted using Docker volumes:

- **EdgeDB Data**: `./data/edgedb` - Database files and indexes
- **Application Logs**: `./docker/*/logs` - Service-specific log files
- **Secrets**: `./secrets` - Sensitive configuration files

## 🚨 Troubleshooting

### Common Issues

1. **Services won't start**
   ```bash
   # Check Docker daemon
   sudo systemctl status docker

   # Check logs
   docker-compose logs
   ```

2. **Frontend can't reach backend**
   - Verify backend is healthy: `curl http://localhost:3001/health`
   - Check Docker network: `docker network ls`

3. **Twitter fetcher fails**
   - Verify bearer token: `cat secrets/twitter-bearer-token`
   - Check rate limits in logs: `docker-compose logs twitter-fetcher`

4. **Database connection issues**
   - Verify EdgeDB is running: `docker-compose ps edgedb`
   - Check initialization: `docker-compose logs edgedb`

### Port Conflicts

If you have port conflicts, modify the ports in `docker-compose.yml`:

```yaml
frontend:
  ports:
    - "8080:80"  # Change from 80:80

backend:
  ports:
    - "3002:3001"  # Change from 3001:3001
```

## 🔄 Updates and Maintenance

### Updating the Application
```bash
# Pull latest code
git pull

# Rebuild and restart
./scripts/docker-deploy.sh stop
./scripts/docker-deploy.sh deploy
```

### Backing Up Data
```bash
# Backup EdgeDB data
docker exec prismatic-edgedb edgedb dump --host localhost --port 5656 > backup.dump

# Restore from backup
docker exec -i prismatic-edgedb edgedb restore --host localhost --port 5656 < backup.dump
```

### Log Rotation
```bash
# Clean old logs
docker system prune -f
docker volume prune -f
```

## 🌐 Production Deployment

For production deployment on a remote server:

1. **Server Requirements**:
   - Docker Engine 20.0+
   - Docker Compose 2.0+
   - 4GB+ RAM
   - 50GB+ storage

2. **Security Considerations**:
   - Use HTTPS with SSL certificates
   - Configure firewall rules
   - Set up log aggregation
   - Implement backup strategies

3. **Scaling Options**:
   - Use Docker Swarm for multi-node deployment
   - Add load balancer for high availability
   - Implement horizontal scaling for API services

## 📞 Support

If you encounter issues:

1. Check the monitoring dashboard: http://localhost:9090
2. Review service logs: `./scripts/docker-deploy.sh logs`
3. Verify all health checks pass: `./scripts/docker-deploy.sh status`

The Docker setup is designed to be production-ready and can be deployed to any Docker-compatible environment with minimal configuration changes.