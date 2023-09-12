from aiokafka import AIOKafkaConsumer
from config import get_config
import json
from database.question_collection import check_exist_question, create_question
from database.mongodb import get_database
from model.question import Question

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
                    q = Question(**question)
                    await create_question(db, q.dict())
    except Exception as e:
        print(e)
    finally:
        # will leave consumer group; perform autocommit if enabled
        await question_bank_consumer.stop()