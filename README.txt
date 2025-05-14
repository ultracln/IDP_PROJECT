-----------------------------------------------------
workflow:

# start cluster
./start-swarm.sh

# stop cluster
./stop-swarm.sh

# useful commands:
docker stack ls
docker stack services bookswap
docker stack ps bookswap
-----------------------------------------------------
for every change in the project (especially backend):
(github actions automatically builds and pushes
the docker images to docker hub)

git add .
git commit -m "your commit message"
git push origin main
-----------------------------------------------------
# pgAdmin - http://localhost:5050/

Name	bookswap-app-db
Host name/address	bookswap-app-db
Port	5432
Maintenance DB	postgres
Username	postgres
Password	postgres
-----------------------------------------------------
# portainer - http://localhost:9000/

a portainer agent running on every node
a single portainer ui container on the manager

username: admin
password: admin1234
-----------------------------------------------------