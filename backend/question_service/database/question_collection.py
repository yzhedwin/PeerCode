from model.question import Question
from .mongodb import AsyncIOMotorClient
from config import get_config
import re
from constant import QUESTION_STATUS

config = get_config
COLLECTION_NAME = "questions"



async def fetch_one_question(client: AsyncIOMotorClient, titleSlug):
    document = await client[COLLECTION_NAME].find_one({"titleSlug": titleSlug})
    if document:
        return Question(**document)
    return None


async def check_exist_question(client: AsyncIOMotorClient, titleSlug):
    document = await client[COLLECTION_NAME].find_one(
        {"titleSlug": re.compile("^" + re.escape(titleSlug) + "$", re.IGNORECASE)}
    )
    if document:
        return True
    return False


async def fetch_all_questions(client: AsyncIOMotorClient):
    questions = []
    cursor = client[COLLECTION_NAME].find({})
    async for document in cursor:
        questions.append(Question(**document))
    return questions


async def create_question(client: AsyncIOMotorClient, question: Question):
    result = await client[COLLECTION_NAME].insert_one(question)
    return result.inserted_id


async def update_one_question(client: AsyncIOMotorClient, question: Question, titleSlug):
    await client[COLLECTION_NAME].replace_one({"titleSlug": titleSlug}, question)
    return True


async def delete_one_question(client: AsyncIOMotorClient, titleSlug):
    await client[COLLECTION_NAME].delete_one({"titleSlug": titleSlug})
    return True


async def delete_all_questions(client: AsyncIOMotorClient):
    await client[COLLECTION_NAME].delete_many({})
    return True
