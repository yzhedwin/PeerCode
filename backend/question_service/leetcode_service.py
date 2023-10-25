from aiokafka import AIOKafkaConsumer
from config import get_config
import json
from database.question_collection import check_exist_question, create_question
from database.mongodb import get_database
from model.question import Question
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport
import json

config = get_config()
question_bank_consumer = AIOKafkaConsumer(config.kafka_topic_question_bank, bootstrap_servers=config.kafka_server_name)


async def question_bank_consume():
    try:
        # consume messages
        async for msg in question_bank_consumer:
            questions = json.loads(msg.value.decode('utf-8'))
            db = await get_database()
            for question in questions:
                exist = await check_exist_question(db, question["title"])
                if not exist:
                    if question["status"] == None:
                        question["status"] = "Not Attempted"
                    transport = AIOHTTPTransport(url="https://leetcode.com/graphql")
                    client = Client(transport=transport, fetch_schema_from_transport=False)
                    query = gql("""
                                        query questionContent($titleSlug: String!) {
                        question(titleSlug: $titleSlug) {
                        content
                        mysqlSchemas
                        }
                    }""")
                    result = await client.execute_async(
                            query, {"titleSlug":  question["titleSlug"]}
                            )
                    if result.get("question"):
                        question["problem"] = result.get("question").get("content")
                    q = Question(**question)
                    await create_question(db, q.dict())
    except Exception as e:
        print(e)
    finally:
        # will leave consumer group; perform autocommit if enabled
        await question_bank_consumer.stop()