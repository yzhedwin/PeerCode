set -o allexport
source docker-compose-dev.env
set +o allexport
docker-compose -f docker-compose-dev.yml up
