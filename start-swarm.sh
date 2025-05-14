#!/bin/bash

echo "Pulling latest Docker images..."
docker pull yourdockerhubusername/auth-service:latest
docker pull yourdockerhubusername/book-service:latest

echo "Deploying stack to Docker Swarm..."
docker stack deploy -c docker-compose.yml bookswap

echo "Deploying Portainer stack..."
docker stack deploy -c portainer-stack.yml portainer