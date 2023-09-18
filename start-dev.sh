set -o allexport
source docker-compose.env
set +o allexport

docker-compose -f docker-compose-dev.yml up -d db redis
sleep 10s
docker-compose -f docker-compose-dev.yml up
sleep 5s