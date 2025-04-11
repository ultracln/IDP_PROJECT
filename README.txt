workflow for now:

cd auth-service
mvn clean package -DskipTests

cd ../book-service
mvn clean package -DskipTests

cd ..
docker-compose -f .\docker-compose.yml -p mobylab-app-db up -d
