.PHONY: help build up down logs clean install dev

# Default target
help:
	@echo "Life Builder City Church - Development Commands"
	@echo ""
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make build      - Build Docker images"
	@echo "  make up         - Start all services"
	@echo "  make down       - Stop all services"
	@echo "  make logs       - Show logs"
	@echo "  make dev        - Start development servers"
	@echo "  make clean      - Clean up containers and images"
	@echo ""

# Install dependencies
install:
	@echo "Installing backend dependencies..."
	cd backend && pip install -r requirements.txt
	@echo "Installing frontend dependencies..."
	cd frontend && npm install

# Build Docker images
build:
	@echo "Building Docker images..."
	docker-compose build

# Start all services
up:
	@echo "Starting all services..."
	docker-compose up -d

# Stop all services
down:
	@echo "Stopping all services..."
	docker-compose down

# Show logs
logs:
	docker-compose logs -f

# Development mode
dev:
	@echo "Starting development servers..."
	@echo "Backend: http://localhost:8000"
	@echo "Frontend: http://localhost:3000"
	cd backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
	cd frontend && npm run dev

# Clean up
clean:
	@echo "Cleaning up containers and images..."
	docker-compose down -v --rmi all

# Database migrations
migrate:
	@echo "Running database migrations..."
	docker-compose exec backend alembic upgrade head

# Create new migration
migration:
	@echo "Creating new migration..."
	@read -p "Enter migration message: " msg; \
	docker-compose exec backend alembic revision --autogenerate -m "$$msg"

# Production deployment
deploy:
	@echo "Deploying to production..."
	docker-compose -f docker-compose.prod.yml up -d --build

# Backup database
backup:
	@echo "Creating database backup..."
	docker-compose exec postgres pg_dump -U church_user church_db > backup_$(shell date +%Y%m%d_%H%M%S).sql

# Restore database
restore:
	@echo "Restoring database from backup..."
	@read -p "Enter backup file path: " file; \
	docker-compose exec -T postgres psql -U church_user church_db < $$file
