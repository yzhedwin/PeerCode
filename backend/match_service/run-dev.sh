set -o allexport
source ../../docker-compose-dev.env
set +o allexport

nodemon server.js & nodemon ./matchmaking/index.js