# Multi-stage build for Angular Prismatic Collections frontend
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Install system dependencies and pnpm in one layer
RUN apk add --no-cache python3 make g++ && \
    npm install -g pnpm@10.15.0 && \
    npm cache clean --force

# Copy package files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies with optimizations
RUN pnpm config set store-dir /tmp/.pnpm-store && \
    pnpm install --frozen-lockfile --prod=false && \
    pnpm store prune

# Copy source code (separate layer for better caching)
COPY src/ ./src/
COPY angular.json tsconfig*.json ./
COPY public/ ./public/ 2>/dev/null || true

# Build the Angular application for production with optimizations
RUN pnpm run build --configuration=production && \
    # Verify build output
    ls -la dist/phantasia/ && \
    # Clean up build dependencies
    rm -rf node_modules .angular

# Production stage with optimized nginx
FROM nginx:1.27-alpine

# Install minimal dependencies for health checks and security
RUN apk add --no-cache --update curl tini && \
    apk upgrade && \
    rm -rf /var/cache/apk/* && \
    # Create non-root user for security
    adduser -D -s /bin/sh -u 1001 nginxuser

# Copy built application from builder stage with optimized permissions
COPY --from=builder --chown=nginxuser:nginxuser /app/dist/phantasia /usr/share/nginx/html

# Copy optimized nginx configurations
COPY docker/frontend/nginx.conf /etc/nginx/nginx.conf
COPY docker/frontend/default.conf /etc/nginx/conf.d/default.conf
COPY docker/frontend/security-headers.conf /etc/nginx/conf.d/security-headers.conf

# Create required directories with optimal permissions
RUN mkdir -p /var/cache/nginx/client_temp \
            /var/cache/nginx/proxy_temp \
            /var/cache/nginx/fastcgi_temp \
            /var/cache/nginx/uwsgi_temp \
            /var/cache/nginx/scgi_temp \
            /var/run/nginx && \
    # Set secure permissions
    chown -R nginxuser:nginxuser /usr/share/nginx/html \
                                 /var/cache/nginx \
                                 /var/run/nginx \
                                 /var/log/nginx && \
    chmod -R 755 /usr/share/nginx/html && \
    chmod -R 755 /var/cache/nginx

# Switch to non-root user for security
USER nginxuser

# Expose port 80
EXPOSE 80

# Optimized health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

# Use tini for proper signal handling and start nginx
ENTRYPOINT ["tini", "--"]
CMD ["nginx", "-g", "daemon off;"]