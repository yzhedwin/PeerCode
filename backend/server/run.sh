set -o allexport
source ../../docker-compose.env
set +o allexport

uvicorn main:app --reload --port 5000 --host 0.0.0.0