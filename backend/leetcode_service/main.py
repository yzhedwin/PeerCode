import json
from config import logger, get_consumer, get_producer, get_config
import asyncio
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

config = get_config()


class QuestionService():
    def __init__(self):
        self.consumer = get_consumer(config.kafka_topic_question_service)
        self.producer = get_producer()
        self.loop = asyncio.new_event_loop()

    async def get_questions_from_leetcode(self):
        transport = AIOHTTPTransport(url="https://leetcode.com/graphql")
        client = Client(transport=transport,
                        fetch_schema_from_transport=False, execute_timeout=None)
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

        for i in range(0, config.leetcode_fetch_limit, 500):
            result = await client.execute_async(
                query, {"categorySlug": "", "skip": i,
                        "limit": config.leetcode_fetch_limit, "filters": {}}
            )
            self.producer.produce(config.kafka_topic_question_bank, json.dumps(
                dict(result)["problemsetQuestionList"]["questions"]))
            self.producer.flush()

    async def get_all_questions(self):
        try:
            count = 0
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    # Initial message consumption may take up to
                    # `session.timeout.ms` for the consumer group to
                    # rebalance and start consuming
                    print("[Kafka] Waiting" + "." * count +
                          " " * (3 - count), end="\r")
                    count += 1
                    count %= 4
                elif msg.error():
                    logger.error(f"[Kafka] {msg.error()}")
                else:
                    # Extract the (optional) key and value, and print.
                    logger.info(f"Consumed event from topic {msg.topic()}")
                    msg = json.loads(msg.value())
                    if msg == "GET QUESTIONS FROM LEETCODE":
                        await self.get_questions_from_leetcode()
        except KeyboardInterrupt:
            self.consumer.close()
            self.loop.stop()
        except Exception as e:
            self.consumer.close()
            self.loop.stop()
            logger.error(f"[Kafka] {e}")


if __name__ == "__main__":
    qs = QuestionService()
    asyncio.set_event_loop(qs.loop)
    qs.loop.create_task(qs.get_all_questions())
    qs.loop.run_forever()
    qs.loop.close()
