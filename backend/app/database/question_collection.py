from model.question import Question
from .mongodb import AsyncIOMotorClient
from config import get_config
import re

config = get_config
COLLECTION_NAME = "questions"


async def fetch_one_question(client: AsyncIOMotorClient, title):
    document = await client[COLLECTION_NAME].find_one({"title": title})
    if document:
        return Question(**document)
    return None


async def check_exist_question(client: AsyncIOMotorClient, title):
    document = await client[COLLECTION_NAME].find_one(
        {"title": re.compile("^" + re.escape(title) + "$", re.IGNORECASE)}
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


async def create_question(client: AsyncIOMotorClient, question):
    result = await client[COLLECTION_NAME].insert_one(question)
    return result


async def delete_one_question(client: AsyncIOMotorClient, title):
    await client[COLLECTION_NAME].delete_one({"title": title})
    return True


async def delete_all_questions(client: AsyncIOMotorClient):
    await client[COLLECTION_NAME].delete_many({})
    return True
