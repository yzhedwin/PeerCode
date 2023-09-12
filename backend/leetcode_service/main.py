import json
from config import logger, get_consumer,get_producer, get_config
from threading import Thread
import asyncio
from gql import Client, gql
from gql.transport.aiohttp import AIOHTTPTransport

config = get_config()

class QuestionService(Thread):
    def __init__(self):
        super().__init__()
        self.consumer = get_consumer(config.kafka_topic_question_service)
        self.producer = get_producer()

    def get_questions_from_leetcode(self):
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
        result = client.execute(
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
            result =  client.execute(
                query, {"titleSlug":  q["titleSlug"]}
            )
            q["problem"] = result["question"]["content"]
            self.producer.produce(config.kafka_topic_question_bank, json.dumps(q))
            self.producer.flush()

    def run(self):
        try:
            count = 0
            while True:
                msg = self.consumer.poll(1.0)
                if msg is None:
                    # Initial message consumption may take up to
                    # `session.timeout.ms` for the consumer group to
                    # rebalance and start consuming
                    print("[Kafka] Waiting" + "." * count + " " * (3 - count), end="\r")
                    count += 1
                    count %= 4
                elif msg.error():
                    logger.error(f"[Kafka] {msg.error()}")
                else:
                    # Extract the (optional) key and value, and print.
                    logger.info(f"Consumed event from topic {msg.topic()}")
                    msg = json.loads(msg.value())
                    if msg == "GET QUESTIONS FROM LEETCODE":
                        self.get_questions_from_leetcode()
        except KeyboardInterrupt:
            self.consumer.close()
        finally:
            # Leave group and commit final offsets
            self.consumer.close()

if __name__ == "__main__":
    qs = QuestionService()
    qs.start()
    qs.join()

