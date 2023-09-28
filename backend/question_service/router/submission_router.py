from fastapi import APIRouter, Depends, HTTPException
from database.mongodb import AsyncIOMotorClient, get_database
from config import get_config
from model.judge import Submission
from database.submision_collection import (
    get_all_submission_from_question,
    add_one_submission,
    remove_all_submissions
)

router = APIRouter(
    prefix="/api/v1/question/submission",
    tags=["submission"],
    responses={404: {"description": "Not found"}},
)

config = get_config()

@router.get("")
async def get_submissions_from_question(userID:str, titleSlug:str, db: AsyncIOMotorClient = Depends(get_database)):
    response = await get_all_submission_from_question(db, userID, titleSlug)
    return response

@router.post("")
async def add_submission_to_db(submission: Submission, db: AsyncIOMotorClient = Depends(get_database)):
    response = await add_one_submission(db, submission.dict())
    return response

@router.delete("/all")
async def delete_all_submissions_from_db(db: AsyncIOMotorClient = Depends(get_database)):
    return await remove_all_submissions(db)
