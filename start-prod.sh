#!/bin/bash

echo "Pulling latest Docker images..."
docker pull ultracln/auth-service:latest
docker pull ultracln/book-service:latest

echo "Deploying stack to Docker Swarm..."
docker stack deploy -c docker-compose.prod.yml bookswap

echo "Deploying Portainer stack..."
docker stack deploy -c portainer-stack.yml portainer