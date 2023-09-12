set -o allexport
source ../docker-compose.env
set +o allexport

./server/run-dev.sh &
./question_service/run-dev.sh