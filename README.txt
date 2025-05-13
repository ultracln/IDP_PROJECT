workflow without docker swarm:

cd auth-service
./mvnw clean package -DskipTests

cd ../book-service
./mvnw clean package -DskipTests

# start.sh
docker-compose -f docker-compose.yml -p bookswap-app up --build -d

# stop.sh
docker-compose -f docker-compose.yml -p bookswap-app down --remove-orphans

--------------------------------------------------
workflow with docker swarm:

# start cluster
./start-swarm.sh

# stop cluster
./stop-swarm.sh

# useful commands:
docker stack ls
docker stack services bookswap
docker stack ps bookswap

--------------------------------------------------
# pgAdmin
Name	bookswap-app-db
Host name/address	bookswap-app-db
Port	5432
Maintenance DB	postgres
Username	postgres
Password	postgres

