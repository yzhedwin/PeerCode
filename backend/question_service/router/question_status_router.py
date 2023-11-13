from fastapi import APIRouter, Depends
from database.mongodb import AsyncIOMotorClient, get_database
from database.question_status_collection import update_question_status, get_question_status_list,get_question_status,add_question_status
from model.question_status import QuestionStatus
router = APIRouter(
    prefix="/api/v1/question-status",
    tags=["question-status"],
    responses={404: {"description": "Not found"}},
)


@router.get("")
async def get_all_question_status(userID: str, db: AsyncIOMotorClient = Depends(get_database)):
  return await get_question_status_list(db, userID)

@router.put("")
async def update_question_status(status: QuestionStatus, db: AsyncIOMotorClient = Depends(get_database)):
  try:
    if get_question_status(status.userID):
      return await update_question_status(db, status)
    return await add_question_status(db, status)
  except Exception as e:
    print(e)