from fastapi import APIRouter
from config import get_config
import requests
from model.judge import Submission

router = APIRouter(
    prefix="/api/v1/question",
    tags=["question"],
    responses={404: {"description": "Not found"}},
)

config = get_config()


@router.get("")
async def get_questions():
    try:
        response = requests.get(config.question_service_url)
        return response.json()
    except Exception as e:
        return e

@router.get("/title/{title}")
async def get_question_by_title(title):
    try:
        response = requests.get(config.question_service_url + f"/title/{title}")
        return response.json()
    except Exception as e:
        return e

@router.get("/problem/{titleSlug}")
async def get_question_problem(titleSlug):
    try:
        response = requests.get(config.question_service_url + f"/problem/{titleSlug}")
        return response.json()
    except Exception as e:
        return e

@router.delete("/title/{title}")
async def delete_question(title):
    try:
        response = requests.delete(config.question_service_url + f"/title/{title}")
        return response.json()
    except Exception as e:
        return e

@router.delete("")
async def delete_questions():
    try:
        response = requests.delete(config.question_service_url)
        return response.json()
    except Exception as e:
        return e

@router.post("/leetcode")
async def add_questions_from_leetcode():
    try:
        response = requests.post(config.question_service_url + "/leetcode")
        return response.json()
    except Exception as e:
        return e

@router.get("/day")
async def get_question_of_the_day():
    try:
        response =  requests.get(config.question_service_url + "/day")
        return response.json()
    except Exception as e:
        return e

@router.get("/history")
async def get_submissions_from_question(userID:str, titleSlug:str):
    try:
        response = requests.get(config.question_service_url + f"/history?userID={userID}&titleSlug={titleSlug}")
        return response.json()
    except Exception as e:
        return e

@router.post("/history")
async def add_submission_to_db(submission: Submission):
    try:
        response = requests.post(config.question_service_url + "/history", data=submission.dict())
        return response.json()
    except Exception as e:
        return e
@router.delete("/history")
async def delete_all_submissions_from_db():
    try:
        response = requests.delete(config.question_service_url + "/history")
        return response.json()
    except Exception as e:
        return e
