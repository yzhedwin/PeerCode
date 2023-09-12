
set -o allexport
source docker-compose.env
set +o allexport

docker-compose -f docker-compose.yml up