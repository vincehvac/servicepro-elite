#!/bin/bash

# ServicePro Elite Deployment Script
# This script deploys ServicePro Elite to production

set -e

echo "🚀 Deploying ServicePro Elite to Production..."
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
check_docker() {
    if ! command -v docker &> /dev/null; then
        print_error "Docker is not installed. Please install Docker."
        exit 1
    fi
    
    if ! command -v docker-compose &> /dev/null; then
        print_error "Docker Compose is not installed. Please install Docker Compose."
        exit 1
    fi
    
    print_status "Docker and Docker Compose are installed."
}

# Build and deploy with Docker
deploy_docker() {
    print_status "Building and deploying with Docker Compose..."
    
    # Stop existing containers
    print_status "Stopping existing containers..."
    docker-compose down
    
    # Build images
    print_status "Building Docker images..."
    docker-compose build
    
    # Start services
    print_status "Starting services..."
    docker-compose up -d
    
    # Wait for services to start
    print_status "Waiting for services to start..."
    sleep 30
    
    # Check service health
    print_status "Checking service health..."
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "Services are healthy!"
    else
        print_warning "Health check failed. Please check the logs."
    fi
}

# Deploy to cloud (example for AWS)
deploy_aws() {
    print_status "Deploying to AWS..."
    
    # This is a placeholder - implement your AWS deployment logic here
    print_warning "AWS deployment not implemented. Please configure your deployment strategy."
}

# Deploy to cloud (example for Google Cloud)
deploy_gcp() {
    print_status "Deploying to Google Cloud..."
    
    # This is a placeholder - implement your GCP deployment logic here
    print_warning "GCP deployment not implemented. Please configure your deployment strategy."
}

# Deploy to cloud (example for Azure)
deploy_azure() {
    print_status "Deploying to Azure..."
    
    # This is a placeholder - implement your Azure deployment logic here
    print_warning "Azure deployment not implemented. Please configure your deployment strategy."
}

# Show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  docker    Deploy using Docker Compose (default)"
    echo "  aws       Deploy to AWS"
    echo "  gcp       Deploy to Google Cloud"
    echo "  azure     Deploy to Azure"
    echo "  help      Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                    # Deploy using Docker Compose"
    echo "  $0 docker             # Deploy using Docker Compose"
    echo "  $0 aws                # Deploy to AWS"
}

# Main function
main() {
    local deployment_type=${1:-docker}
    
    echo "ServicePro Elite Deployment"
    echo "==========================="
    echo ""
    
    case $deployment_type in
        docker)
            check_docker
            deploy_docker
            ;;
        aws)
            deploy_aws
            ;;
        gcp)
            deploy_gcp
            ;;
        azure)
            deploy_azure
            ;;
        help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown deployment type: $deployment_type"
            show_usage
            exit 1
            ;;
    esac
    
    echo ""
    print_status "Deployment completed! 🎉"
    echo ""
    echo "ServicePro Elite is now running!"
    echo "Frontend: http://localhost"
    echo "API: http://localhost/api"
    echo "API Documentation: http://localhost/api-docs"
    echo ""
    echo "For production deployment, make sure to:"
    echo "1. Use proper SSL certificates"
    echo "2. Configure environment variables"
    echo "3. Set up monitoring and logging"
    echo "4. Configure backup strategies"
    echo ""
    echo "Check the logs with: docker-compose logs -f"
}

# Run main function
main "$@"