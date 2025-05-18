#!/bin/bash

echo "Removing Docker stack..."
docker stack rm bookswap

echo "Removing Portainer stack..."
docker stack rm portainer

echo "Removing Monitoring stack..."
docker stack rm monitoring