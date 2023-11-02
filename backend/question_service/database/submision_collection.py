from model.judge import Submission
from .mongodb import AsyncIOMotorClient
from config import get_config
import re

config = get_config
COLLECTION_NAME = "submissions"

async def add_one_submission(client: AsyncIOMotorClient, submission: Submission):
    result = await client[COLLECTION_NAME].insert_one(submission)
    if result:
        return "Added submission to database"
    
async def get_all_submission(client: AsyncIOMotorClient):
    submissions = []
    cursor = client[COLLECTION_NAME].find({})
    async for document in cursor:
        submissions.append(Submission(**document))
    return submissions

async def get_all_submission_from_question(client: AsyncIOMotorClient, userID, titleSlug):
    submissions = []
    cursor = client[COLLECTION_NAME].find({"submission.userID": userID, "submission.titleSlug": titleSlug})
    async for document in cursor:
        submissions.append(Submission(**document))
    return submissions

async def get_all_submission_from_user(client: AsyncIOMotorClient, userID):
    submissions = []
    cursor = client[COLLECTION_NAME].find({"submission.userID": userID})
    async for document in cursor:
        submissions.append(Submission(**document))
    return submissions

async def remove_all_submissions(client: AsyncIOMotorClient):
    await client[COLLECTION_NAME].delete_many({})
    return True
