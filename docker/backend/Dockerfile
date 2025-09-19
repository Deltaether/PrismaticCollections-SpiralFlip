# Multi-stage Node.js backend for optimal production performance
FROM node:20-alpine AS dependencies

# Install build dependencies and runtime dependencies
RUN apk add --no-cache --update \
    curl \
    dumb-init \
    && apk upgrade \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Copy package files for dependency installation
COPY src/geldb/backend/package.json ./
COPY src/geldb/backend/package-lock.json* ./

# Install ALL dependencies (dev + prod) for building
RUN npm install && \
    npm cache clean --force --loglevel=error

# Production dependency stage
FROM node:20-alpine AS prod-dependencies

WORKDIR /app

# Copy package files
COPY src/geldb/backend/package.json ./
COPY src/geldb/backend/package-lock.json* ./

# Install only production dependencies
RUN npm install --only=production --no-audit --no-fund && \
    npm cache clean --force --loglevel=error

# Build stage
FROM dependencies AS builder

WORKDIR /app

# Copy source code for building (excluding node_modules)
COPY src/geldb/backend/src/ ./src/
COPY src/geldb/backend/package.json ./
COPY src/geldb/backend/tsconfig.json ./
COPY src/geldb/dbschema/ ./dbschema/
COPY src/geldb/gel.toml ./edgedb.toml

# Build TypeScript with optimizations
RUN npm run build && \
    # Verify build output
    ls -la dist/ && \
    # Remove development dependencies after build
    rm -rf src/ tsconfig.json webpack.config.js

# Final production stage
FROM node:20-alpine AS production

# Install minimal runtime dependencies
RUN apk add --no-cache --update \
    curl \
    dumb-init \
    tini \
    && apk upgrade \
    && rm -rf /var/cache/apk/*

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodeuser -u 1001 -G nodejs

# Copy production dependencies
COPY --from=prod-dependencies --chown=nodeuser:nodejs /app/node_modules ./node_modules

# Copy built application
COPY --from=builder --chown=nodeuser:nodejs /app/dist ./dist
COPY --from=builder --chown=nodeuser:nodejs /app/package.json ./
COPY --from=builder --chown=nodeuser:nodejs /app/dbschema ./dbschema
COPY --from=builder --chown=nodeuser:nodejs /app/edgedb.toml ./

# Create empty .env file to prevent dotenv errors
RUN touch .env && chown nodeuser:nodejs .env

# Create logs directory
RUN mkdir -p /app/logs && \
    chown -R nodeuser:nodejs /app && \
    chmod -R 755 /app

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 3001

# Optimized health check
HEALTHCHECK --interval=15s --timeout=5s --start-period=20s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

# Set environment variables for production
ENV NODE_ENV=production \
    NODE_OPTIONS="--enable-source-maps --max-old-space-size=512" \
    PORT=3001

# Use tini for proper signal handling and start the application
ENTRYPOINT ["tini", "--"]
CMD ["node", "dist/server.js"]