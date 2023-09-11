# read env var from dev env file
cd server
uvicorn main:app --reload --port ${SERVER_PORT} --host localhost
