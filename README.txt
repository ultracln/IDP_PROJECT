workflow for now:

cd auth-service
mvn clean package -DskipTests

cd ../book-service
mvn clean package -DskipTests

# start.sh
docker-compose -f docker-compose.yml -p mobylab-app up --build -d

# stop.sh
docker-compose -f docker-compose.yml -p mobylab-app down -v --remove-orphans


# pgAdmin
Name	mobylab-db
Host name/address	mobylab-app-mobylab-app-db-1
Port	5432
Maintenance DB	postgres
Username	postgres
Password	postgres

