from fastapi import APIRouter, Depends
import requests
from config import get_config
from model.question_status import QuestionStatus

router = APIRouter(
    prefix="/api/v1/question-status",
    tags=["question-status"],
    responses={404: {"description": "Not found"}},
)

config = get_config()

@router.get("")
async def get_all_question_status(userID: str):
  try:
    response = requests.get(config.question_service_url + "/question-status", params={"userID": userID})
    return response.json()
  except Exception as e:
    return e

@router.put("")
async def update_question_status(status: QuestionStatus):
  try:
    response = requests.put(config.question_service_url + "/question-status", json=status.dict())
    return response.json()
  except Exception as e:
    return e

@router.delete("")
async def remove_all_question_status():
  try:
    response = requests.delete(config.question_service_url + "/question-status")
    return response.json()
  except Exception as e:
    return e