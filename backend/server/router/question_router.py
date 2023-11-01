from fastapi import APIRouter
from config import get_config
import requests
from model.question import Question
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


@router.get("/title/{titleSlug}")
async def get_question_by_title(titleSlug):
    try:
        response = requests.get(
            config.question_service_url + f"/title/{titleSlug}")
        return response.json()
    except Exception as e:
        return e


@router.get("/problem/{titleSlug}")
async def get_question_problem(titleSlug):
    try:
        response = requests.get(
            config.question_service_url + f"/problem/{titleSlug}")
        return response.json()
    except Exception as e:
        return e


@router.post("/create")
async def add_question_to_db(question: Question):
    try:
        print(question.dict())
        response = requests.post(
            config.question_service_url + "/create", json=question.dict())
        return response.json()
    except Exception as e:
        return e


@router.post("/update/{titleSlug}")
async def update_question(question: Question, titleSlug):
    try:
        print(titleSlug)
        response = requests.post(
            config.question_service_url + f"/update/{titleSlug}", json=question.dict())
        return response.json()
    except Exception as e:
        return e


@router.delete("/title/{titleSlug}")
async def delete_question(titleSlug):
    print(titleSlug)
    try:
        response = requests.delete(
            config.question_service_url + f"/title/{titleSlug}")
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
        response = requests.get(config.question_service_url + "/day")
        return response.json()
    except Exception as e:
        return e


@router.get("/history/user/question")
async def get_submissions_from_question(userID: str, titleSlug: str):
    try:
        response = requests.get(config.question_service_url +
                                f"/history/user/question?userID={userID}&titleSlug={titleSlug}")
        return response.json()
    except Exception as e:
        return e


@router.get("/history/user")
async def get_submissions_from_user(userID: str):
    try:
        response = requests.get(
            config.question_service_url + f"/history/user?userID={userID}")
        return response.json()
    except Exception as e:
        return e


@router.get("/history")
async def get_submissions():
    try:
        response = requests.get(config.question_service_url + f"/history")
        return response.json()
    except Exception as e:
        return e


@router.post("/history")
async def add_submission_to_db(submission: Submission):
    try:
        response = requests.post(
            config.question_service_url + "/history", data=submission.dict())
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
