.PHONY: up down build clean logs help logs-backend logs-frontend status all

# Detect Docker Compose (v2 plugin or legacy)
COMPOSE := $(shell if command -v docker >/dev/null 2>&1 && docker compose version >/dev/null 2>&1; then echo "docker compose"; elif command -v docker-compose >/dev/null 2>&1; then echo "docker-compose"; else echo "docker-compose"; fi)

# Start all services
up:
	@echo "🚀 Starting all services..."
	$(COMPOSE) up --build -d
	@echo "✅ Services are starting up!"
	@echo "📱 Frontend will be available at: http://localhost:8081"
	@echo "🔗 Backend API will be available at: http://localhost:8080"
	@echo ""
	@echo "⏳ Wait a moment for all services to fully start, then visit the frontend URL"

# Stop all services
down:
	@echo "🛑 Stopping all services..."
	$(COMPOSE) down
	@echo "✅ All services stopped"

# Build without starting
build:
	@echo "🔨 Building all services..."
	$(COMPOSE) build
	@echo "✅ Build complete"

# Clean up everything (containers, volumes, images)
clean:
	@echo "🧹 Cleaning up..."
	$(COMPOSE) down -v --rmi all
	docker system prune -f
	@echo "✅ Cleanup complete"

# View logs
logs:
	$(COMPOSE) logs -f

# View logs for a specific service
logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend


# Check status of services
status:
	$(COMPOSE) ps

# Help
help:
	@echo "📋 Available commands:"
	@echo "  make up         - Start all services (UI, API, DB)"
	@echo "  make down       - Stop all services"
	@echo "  make build      - Build all services without starting"
	@echo "  make clean      - Clean up all containers, volumes, and images"
	@echo "  make logs       - View logs from all services"
	@echo "  make logs-*     - View logs from specific service (backend, frontend)"
	@echo "  make status     - Check status of all services"
	@echo "  make help       - Show this help message"

# Default target
all: up
