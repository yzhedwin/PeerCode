set -o allexport
source ../../docker-compose-dev.env
set +o allexport

npx nodemon server.js & npx nodemon ./matchmaking/index.js & npx nodemon ./router/openai_router.js