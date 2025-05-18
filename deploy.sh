#!/bin/bash

echo "Pulling latest Docker images..."
docker pull ultracln/auth-service:latest
docker pull ultracln/book-service:latest
docker pull ultracln/frontend:latest

echo "Deploying stack to Docker Swarm..."
docker stack deploy -c docker-compose.prod.yml bookswap

echo "Deploying Portainer stack..."
docker stack deploy -c portainer-stack.yml portainer

echo "Deploying Monitoring stack..."
docker stack deploy -c prometheus-stack.yml monitoring

echo "Forcing service updates to ensure latest images are used..."
docker service update --image ultracln/auth-service:latest bookswap_auth-service
docker service update --image ultracln/book-service:latest bookswap_book-service
docker service update --image ultracln/frontend:latest bookswap_frontend