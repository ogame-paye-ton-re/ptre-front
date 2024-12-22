# Variables
COMPOSE = docker compose
PROFILE ?= dev  # Default profile

# Targets
.PHONY: up down clean purge

## Start the services with the specified profile
up:
	@echo "Starting Docker Compose with profile: $(PROFILE)"
	$(COMPOSE) --profile $(PROFILE) up -d

## Stop and remove containers
down:
	@echo "Stopping and removing containers"
	$(COMPOSE) down --remove-orphans

## Clean up containers and networks (preserve volumes)
clean:
	@echo "Cleaning up containers and networks (preserving volumes)"
	$(COMPOSE) down --remove-orphans
	@docker ps -aq | xargs -r docker rm -f  # Remove all containers

## Purge everything (containers, volumes, networks, and images)
purge:
	@echo "Purging all containers, volumes, and unused resources"
	$(COMPOSE) down -v --remove-orphans
	@docker ps -aq | xargs -r docker rm -f  # Remove all containers
	@docker volume prune -f                 # Remove unused volumes
	@docker system prune -f                 # Remove unused resources
