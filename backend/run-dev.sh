# read env var from dev env file
set -o allexport
source ../docker-compose.env
set +o allexport

cd app
uvicorn main:app --reload --port ${SERVER_PORT} --host 0.0.0.0
