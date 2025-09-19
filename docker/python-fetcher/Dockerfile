# Multi-stage Python Twitter fetcher for optimal production performance
FROM python:3.12-slim AS base

# Set Python environment variables for optimal performance
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONFAULTHANDLER=1 \
    PYTHONHASHSEED=random \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Install system dependencies and security updates
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && apt-get upgrade -y \
    && rm -rf /var/lib/apt/lists/* \
    && apt-get clean

# Dependency installation stage
FROM base AS dependencies

WORKDIR /app

# Upgrade pip and install wheel
RUN pip install --upgrade pip wheel setuptools

# Copy requirements and install dependencies
COPY docker/python-fetcher/requirements.txt ./

# Install Python dependencies with optimizations
RUN pip install --no-cache-dir --no-deps --requirement requirements.txt \
    && pip check

# Production stage
FROM base AS production

WORKDIR /app

# Create non-root user for security
RUN groupadd -r pythonuser && \
    useradd -r -g pythonuser -u 1001 pythonuser && \
    mkdir -p /app/logs /app/data && \
    chown -R pythonuser:pythonuser /app

# Copy Python dependencies from dependencies stage
COPY --from=dependencies /usr/local/lib/python3.12/site-packages /usr/local/lib/python3.12/site-packages
COPY --from=dependencies /usr/local/bin /usr/local/bin

# Copy application files with proper ownership
COPY --chown=pythonuser:pythonuser twitter-feedback-python/simple_fetcher.py ./
COPY --chown=pythonuser:pythonuser docker/python-fetcher/entrypoint.py ./
COPY --chown=pythonuser:pythonuser docker/python-fetcher/scheduler.py ./
COPY --chown=pythonuser:pythonuser docker/python-fetcher/requirements.txt ./

# Copy EdgeDB configuration
COPY --chown=pythonuser:pythonuser src/geldb/dbschema/ ./dbschema/
COPY --chown=pythonuser:pythonuser src/geldb/gel.toml ./edgedb.toml

# Set proper permissions and switch to non-root user
RUN chmod +x entrypoint.py scheduler.py simple_fetcher.py
USER pythonuser

# Expose health check port
EXPOSE 8080

# Optimized health check with better error handling
HEALTHCHECK --interval=30s --timeout=15s --start-period=45s --retries=3 \
  CMD python -c "import requests; requests.get('http://localhost:8080/health', timeout=10).raise_for_status()" || exit 1

# Set environment variables for production
ENV PYTHONPATH=/app \
    SCHEDULER_LOG_LEVEL=INFO \
    HEALTH_CHECK_PORT=8080

# Start the scheduler with proper signal handling
CMD ["python", "-u", "scheduler.py"]