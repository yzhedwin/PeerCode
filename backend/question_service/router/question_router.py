from fastapi import APIRouter, Depends, HTTPException
from database.mongodb import AsyncIOMotorClient, get_database
from config import get_config, get_producer
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
import json
from model.question import Question
from database.question_collection import (
    fetch_all_questions,
    fetch_one_question,
    delete_all_questions,
    delete_one_question,
)

router = APIRouter(
    prefix="/api/v1/question",
    tags=["question"],
    responses={404: {"description": "Not found"}},
)

config = get_config()


@router.get("")
async def get_questions(db: AsyncIOMotorClient = Depends(get_database)):
    response = await fetch_all_questions(db)
    return response


@router.get("/title/{title}", response_model=Question)
async def get_question_by_title(title, db: AsyncIOMotorClient = Depends(get_database)):
    response = await fetch_one_question(db, title)
    if response:
        return response
    raise HTTPException(404, f"There is no question with the name {title}")


@router.delete("/{title}")
async def delete_question(title, db: AsyncIOMotorClient = Depends(get_database)):
    question = await fetch_one_question(db, title)
    if not question:
        raise HTTPException(400, f"Question {title} does not exist")
    response = await delete_one_question(db, title)
    if response:
        return "Successfully deleted question"


@router.delete("")
async def delete_questions(db: AsyncIOMotorClient = Depends(get_database)):
    response = await delete_all_questions(db)
    if response:
        return "Successfully deleted all questions"
    raise HTTPException(500, "Something went wrong")


@router.post("")
async def add_questions_from_leetcode():
    producer = get_producer()
    producer.produce(config.kafka_topic_question_service, json.dumps("GET QUESTIONS FROM LEETCODE"))
    producer.flush()
    return "Successfully added questions from Leetcode"

@router.get("/day")
async def get_question_of_the_day():
    transport = AIOHTTPTransport(url="https://leetcode.com/graphql")
    client = Client(transport=transport, fetch_schema_from_transport=False)
    query = gql("""query questionOfToday {
  activeDailyCodingChallengeQuestion {
    date
    userStatus
    link
    question {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      hasVideoSolution
      hasSolution
      topicTags {
        name
        id
        slug
      }
    }
  }
}""")
    r1 = await client.execute_async(
            query
        )
    query = gql("""query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
        content
        mysqlSchemas
    }
    }""")
    r2 = await client.execute_async(
        query, {"titleSlug":  r1["activeDailyCodingChallengeQuestion"]["question"]["titleSlug"]})
    r1["activeDailyCodingChallengeQuestion"]["question"]["problem"] = r2["question"]["content"]
    return Question(**r1["activeDailyCodingChallengeQuestion"]["question"])
   
