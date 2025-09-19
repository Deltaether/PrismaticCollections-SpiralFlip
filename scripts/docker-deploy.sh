#!/bin/bash

# Prismatic Collections Docker Deployment Script
# This script sets up and deploys the complete multi-container architecture

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="prismatic-collections"
COMPOSE_FILE="docker-compose.yml"
ENV_FILE=".env.docker"

echo -e "${PURPLE}🎭 Prismatic Collections Docker Deployment${NC}"
echo -e "${CYAN}===========================================${NC}"

# Function to print colored status
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if Docker and Docker Compose are installed
check_dependencies() {
    print_info "Checking dependencies..."

    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker first."
        exit 1
    fi

    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose first."
        exit 1
    fi

    print_status "Docker and Docker Compose are available"
}

# Create necessary directories
create_directories() {
    print_info "Creating necessary directories..."

    mkdir -p data/edgedb
    mkdir -p secrets
    mkdir -p docker/backend/logs
    mkdir -p docker/python-fetcher/logs
    mkdir -p docker/frontend/logs

    print_status "Directories created"
}

# Setup secrets
setup_secrets() {
    print_info "Setting up secrets..."

    # Check if Twitter bearer token exists
    if [ ! -f "Twitter-bearer-token" ]; then
        print_warning "Twitter bearer token file not found!"
        print_info "Please create 'Twitter-bearer-token' file with your Twitter API bearer token"
        read -p "Do you want to continue without the Twitter token? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    else
        # Copy token to secrets directory
        cp Twitter-bearer-token secrets/twitter-bearer-token
        print_status "Twitter bearer token configured"
    fi
}

# Build Docker images
build_images() {
    print_info "Building Docker images..."

    echo -e "${CYAN}Building frontend image...${NC}"
    docker-compose build frontend

    echo -e "${CYAN}Building backend image...${NC}"
    docker-compose build backend

    echo -e "${CYAN}Building Twitter fetcher image...${NC}"
    docker-compose build twitter-fetcher

    print_status "All images built successfully"
}

# Start services
start_services() {
    print_info "Starting services..."

    # Start EdgeDB first and wait for it to be healthy
    echo -e "${CYAN}Starting EdgeDB...${NC}"
    docker-compose up -d edgedb

    # Wait for EdgeDB to be healthy
    echo -e "${YELLOW}Waiting for EdgeDB to be ready...${NC}"
    timeout 120 bash -c 'until docker-compose ps edgedb | grep -q "healthy"; do sleep 2; done'

    if [ $? -eq 0 ]; then
        print_status "EdgeDB is ready"
    else
        print_error "EdgeDB failed to start within 2 minutes"
        exit 1
    fi

    # Start backend services
    echo -e "${CYAN}Starting backend services...${NC}"
    docker-compose up -d backend twitter-fetcher

    # Wait for backend to be ready
    echo -e "${YELLOW}Waiting for backend to be ready...${NC}"
    timeout 60 bash -c 'until curl -f http://localhost:3001/health &>/dev/null; do sleep 2; done'

    if [ $? -eq 0 ]; then
        print_status "Backend is ready"
    else
        print_warning "Backend may not be fully ready, continuing..."
    fi

    # Start frontend
    echo -e "${CYAN}Starting frontend...${NC}"
    docker-compose up -d frontend

    # Start monitoring (optional)
    echo -e "${CYAN}Starting monitoring dashboard...${NC}"
    docker-compose up -d monitoring

    print_status "All services started"
}

# Display service status
show_status() {
    print_info "Service Status:"
    echo
    docker-compose ps
    echo

    print_info "Service URLs:"
    echo -e "${GREEN}🌐 Frontend (Angular):${NC} http://localhost:80"
    echo -e "${GREEN}⚡ Backend API:${NC} http://localhost:3001"
    echo -e "${GREEN}🐦 Twitter Fetcher:${NC} http://localhost:8080/health"
    echo -e "${GREEN}🗄️  EdgeDB Admin:${NC} http://localhost:8888"
    echo -e "${GREEN}📊 Monitoring:${NC} http://localhost:9090"
    echo
}

# Health check all services
health_check() {
    print_info "Performing health checks..."

    # Frontend
    if curl -f http://localhost:80/health &>/dev/null; then
        print_status "Frontend: Healthy"
    else
        print_warning "Frontend: Not responding"
    fi

    # Backend
    if curl -f http://localhost:3001/health &>/dev/null; then
        print_status "Backend: Healthy"
    else
        print_warning "Backend: Not responding"
    fi

    # Twitter Fetcher
    if curl -f http://localhost:8080/health &>/dev/null; then
        print_status "Twitter Fetcher: Healthy"
    else
        print_warning "Twitter Fetcher: Not responding"
    fi

    # EdgeDB (check if port is open)
    if nc -z localhost 5656 &>/dev/null; then
        print_status "EdgeDB: Accessible"
    else
        print_warning "EdgeDB: Not accessible"
    fi
}

# Main deployment function
deploy() {
    echo -e "${PURPLE}Starting deployment...${NC}"

    check_dependencies
    create_directories
    setup_secrets
    build_images
    start_services

    echo
    print_status "Deployment completed!"
    echo

    show_status

    echo
    print_info "Waiting 10 seconds before health check..."
    sleep 10
    health_check

    echo
    print_info "Deployment Summary:"
    echo -e "${GREEN}✅ All services deployed successfully${NC}"
    echo -e "${BLUE}🚀 Access your application at: http://localhost:80${NC}"
    echo -e "${BLUE}📊 Monitor services at: http://localhost:9090${NC}"
    echo
    echo -e "${YELLOW}📝 To view logs: docker-compose logs -f [service-name]${NC}"
    echo -e "${YELLOW}🔄 To restart: docker-compose restart [service-name]${NC}"
    echo -e "${YELLOW}🛑 To stop all: docker-compose down${NC}"
}

# Handle command line arguments
case "${1:-deploy}" in
    "deploy")
        deploy
        ;;
    "start")
        print_info "Starting existing services..."
        docker-compose up -d
        show_status
        ;;
    "stop")
        print_info "Stopping all services..."
        docker-compose down
        print_status "All services stopped"
        ;;
    "restart")
        print_info "Restarting all services..."
        docker-compose restart
        show_status
        ;;
    "logs")
        docker-compose logs -f
        ;;
    "status")
        show_status
        health_check
        ;;
    "clean")
        print_warning "This will remove all containers and volumes!"
        read -p "Are you sure? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker-compose down -v --remove-orphans
            docker system prune -f
            print_status "Cleanup completed"
        fi
        ;;
    *)
        echo "Usage: $0 {deploy|start|stop|restart|logs|status|clean}"
        echo
        echo "Commands:"
        echo "  deploy  - Full deployment (default)"
        echo "  start   - Start existing services"
        echo "  stop    - Stop all services"
        echo "  restart - Restart all services"
        echo "  logs    - Show logs for all services"
        echo "  status  - Show service status and URLs"
        echo "  clean   - Remove all containers and volumes"
        exit 1
        ;;
esac