-----------------------------------------------------
LOCAL DEV WORKFLOW:
(making local changes and testing them without
pushing to github/docker hub)

# start cluster
./start-dev.sh

# stop cluster
./stop.sh

# useful commands:
docker stack ls
docker stack services bookswap
docker stack ps bookswap
-----------------------------------------------------
GIT WORKFLOW (auto-build & push via github actions)
for every change in the project (especially backend):

git add .
git commit -m "your commit message"
git push origin main

(github actions automatically builds and pushes
the docker images to docker hub)
-----------------------------------------------------
PROD WORKFLOW:
(deploy the latest working images)

# start cluster
./start-prod.sh

# stop cluster
./stop.sh
-----------------------------------------------------
PGADMIN - http://localhost:5050/

email: admin@admin.com
password: admin

server:
Name	bookswap-app-db
Host name/address	bookswap-app-db
Port	5432
Maintenance DB	postgres
Username	postgres
Password	postgres
-----------------------------------------------------
PORTAINER - http://localhost:9000/

a portainer agent running on every node
a single portainer ui container on the manager

username: admin
password: admin1234
-----------------------------------------------------
FRONTEND - http://localhost:3000/

cd frontend/
npm install
npm run dev
-----------------------------------------------------
ENDPOINTS:
- auth-service:
  - 'POST /api/v1/auth/register' – inregistrare utilizator
  - 'POST /api/v1/auth/login' – autentificare utilizator (returneaza JWT)
  - 'GET /api/v1/auth/users/{id}/email' – obtinere email dupa ID
  - 'GET /api/v1/auth/users/email/{email}/id' – obtinere ID dupa email

- book-service
  - 'GET /book/getByAuthor' – carti filtrate dupa autor
  - 'GET /book/all' – lista completa a cartilor
  - 'POST /book/addBook' – adaugare carte (autentificare necesara)
  - 'DELETE /book/deleteByTitle' – stergere carte dupa titlu (USER/ADMIN)
  
  - 'GET /offers/me' – ofertele utilizatorului curent
  - 'GET /offers/received' – ofertele primite
  - 'POST /offers/create' – creare oferta
  - 'POST /offers/respond' – acceptare / respingere oferta