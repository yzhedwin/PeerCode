from fastapi import APIRouter
from config import get_config
import requests

router = APIRouter(
    prefix="/api/v1/question",
    tags=["question"],
    responses={404: {"description": "Not found"}},
)

config = get_config()


@router.get("")
async def get_questions():
    response = requests.get(config.question_service_url)
    return response.json()

@router.get("/title/{title}")
async def get_question_by_title(title):
    response = requests.get(config.question_service_url + f"/title/{title}")
    return response.json()


@router.delete("/{title}")
async def delete_question(title):
	response = requests.delete(config.question_service_url + f"/title/{title}")
	return response.json()


@router.delete("")
async def delete_questions():
	response = requests.delete(config.question_service_url)
	return response.json()

@router.post("")
async def add_questions_from_leetcode():
    response = requests.post(config.question_service_url)
    return response.json()

@router.get("/day")
async def get_question_of_the_day():
	response =  requests.get(config.question_service_url + "/day")
	return response.json()
