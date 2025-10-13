#!/bin/bash

# ServicePro Elite Setup Script
# This script sets up the entire ServicePro Elite application

set -e

echo "🚀 Setting up ServicePro Elite..."
echo "=================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if required tools are installed
check_requirements() {
    print_status "Checking requirements..."
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js v16 or higher."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm."
        exit 1
    fi
    
    # Check PostgreSQL
    if ! command -v psql &> /dev/null; then
        print_warning "PostgreSQL client (psql) is not installed. You'll need to set up PostgreSQL manually."
    fi
    
    # Check Redis
    if ! command -v redis-cli &> /dev/null; then
        print_warning "Redis is not installed. You'll need to set up Redis manually."
    fi
    
    print_status "Requirements check completed."
}

# Set up backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating backend .env file..."
        cp .env.example .env
        print_warning "Please edit backend/.env file with your configuration"
    fi
    
    # Run database migrations
    print_status "Running database migrations..."
    npm run migrate || print_warning "Database migrations failed. Please check your database connection."
    
    # Run seeds
    print_status "Seeding database..."
    npm run seed || print_warning "Database seeding failed."
    
    cd ..
    print_status "Backend setup completed."
}

# Set up frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating frontend .env file..."
        cp .env.example .env
        print_warning "Please edit frontend/.env file with your configuration"
    fi
    
    cd ..
    print_status "Frontend setup completed."
}

# Set up mobile app
setup_mobile() {
    print_status "Setting up mobile app..."
    
    cd mobile
    
    # Install dependencies
    print_status "Installing mobile dependencies..."
    npm install
    
    cd ..
    print_status "Mobile app setup completed."
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p backend/uploads
    mkdir -p backend/logs
    mkdir -p frontend/build
    mkdir -p mobile/assets
    
    print_status "Directories created."
}

# Set permissions
set_permissions() {
    print_status "Setting permissions..."
    
    chmod +x scripts/*.sh
    
    print_status "Permissions set."
}

# Main setup function
main() {
    echo "ServicePro Elite Setup"
    echo "======================"
    echo ""
    
    check_requirements
    create_directories
    set_permissions
    setup_backend
    setup_frontend
    setup_mobile
    
    echo ""
    print_status "Setup completed successfully! 🎉"
    echo ""
    echo "Next steps:"
    echo "1. Edit the .env files with your configuration"
    echo "2. Set up PostgreSQL and Redis if not already installed"
    echo "3. Start the services:"
    echo "   - Backend: cd backend && npm run dev"
    echo "   - Frontend: cd frontend && npm start"
    echo "   - Mobile: cd mobile && npm start"
    echo ""
    echo "For production deployment, see docs/DEPLOYMENT.md"
}

# Run main function
main "$@"