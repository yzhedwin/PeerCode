# read env var from dev env file
set -o allexport
source ../../docker-compose.env
set +o allexport

uvicorn main:app --reload --port 5001 --host localhost
