from fastapi import APIRouter, Depends, HTTPException
from database.mongodb import AsyncIOMotorClient, get_database
from config import get_config
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

from model.question import Question
from database.question_collection import (
    fetch_all_questions,
    fetch_one_question,
    check_exist_question,
    delete_all_questions,
    delete_one_question,
    create_question,
)

router = APIRouter(
    prefix="/api/question",
    tags=["question"],
    responses={404: {"description": "Not found"}},
)

config = get_config()


@router.get("")
async def get_questions(db: AsyncIOMotorClient = Depends(get_database)):
    response = await fetch_all_questions(db)
    return response


@router.get("/{title}", response_model=Question)
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
async def add_questions_from_leetcode(db: AsyncIOMotorClient = Depends(get_database)):
    transport = AIOHTTPTransport(url="https://leetcode.com/graphql")
    client = Client(transport=transport, fetch_schema_from_transport=False)
    query = gql(
        """query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
  problemsetQuestionList: questionList(
    categorySlug: $categorySlug
    limit: $limit
    skip: $skip
    filters: $filters
  ) {
    total: totalNum
    questions: data {
      acRate
      difficulty
      freqBar
      frontendQuestionId: questionFrontendId
      isFavor
      paidOnly: isPaidOnly
      status
      title
      titleSlug
      topicTags {
        name
        id
        slug
      }
      hasSolution
      hasVideoSolution
    }
  }
}
"""
    )
    result = await client.execute_async(
        query, {"categorySlug": "", "skip": 0, "limit": 50, "filters": {}}
    )
    for q in dict(result)["problemsetQuestionList"]["questions"]:
        query = gql("""
                    query questionContent($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    content
    mysqlSchemas
  }
}""")
        result = await client.execute_async(
            query, {"titleSlug":  q["titleSlug"]}
        )
        q["problem"] = result["question"]["content"]
        question = Question(**q)
        response = await create_question(db, question.dict())
        if response is None:
            raise HTTPException(400, "Bad request")
        
    return "Successfully added questions from Leetcode"




