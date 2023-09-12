# read env var from dev env file
cd question_service
uvicorn main:app --reload --port 5001 --host localhost
