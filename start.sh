
set -o allexport
source docker-compose.env
set +o allexport

docker-compose -f docker-compose.yml up -d judge0_db judge0_redis peercode_zookeeper peercode_kafka
sleep 10s
docker-compose -f docker-compose.yml up
sleep 5s