echo "Building Spring Boot JARs..."
cd auth-service
./mvnw clean package -DskipTests
cd ../book-service
./mvnw clean package -DskipTests
cd ..

echo "Building Docker images..."
docker build -t bookswap/auth-service ./auth-service
docker build -t bookswap/book-service ./book-service

echo "Deploying stack to Docker Swarm..."
docker stack deploy -c docker-compose.dev.yml bookswap

echo "Deploying Portainer stack..."
docker stack deploy -c portainer-stack.yml portainer

echo "Deploying Monitoring stack..."
docker stack deploy -c prometheus-stack.yml monitoring