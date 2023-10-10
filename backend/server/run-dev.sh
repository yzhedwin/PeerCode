# read env var from dev env file
set -o allexport
source ../../docker-compose-dev.env
set +o allexport

uvicorn main:app --reload --port ${SERVER_PORT} --host localhost
