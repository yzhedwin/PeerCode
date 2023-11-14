from pydantic import BaseSettings
from confluent_kafka import Consumer, OFFSET_END, Producer
import logging

class Config(BaseSettings):
    # the following variables will read from env var
    kafka_server_name: str
    kafka_topics: str
    kafka_topic_question_service: str
    kafka_topic_question_bank: str
    kafka_topic_question_of_the_day: str
    kafka_group_leetcode_service: str
    leetcode_fetch_limit: int

def get_config():
    return Config()


def get_producer():
    config = get_config()
    producer = Producer({
        "bootstrap.servers": config.kafka_server_name
    })
    return producer

def delivery_callback(err, msg):
    if err:
        print(f"ERROR: Message failed delivery: {err}")
    else:
        print(f"Produced event to topic {msg.topic()}")

def get_consumer(topic):
    config = get_config()
    consumer = Consumer({
        "bootstrap.servers": config.kafka_server_name,
        "group.id": config.kafka_group_leetcode_service
    })
    consumer.subscribe([topic], on_assign=on_assign)
    return consumer

def on_assign(consumer, partitions):
    for partition in partitions:
        partition.offset = OFFSET_END
    consumer.assign(partitions)


logging.basicConfig(
    format="%(asctime)s %(levelname)-8s %(message)s",
    level=logging.DEBUG,
    datefmt="%Y-%m-%d %H:%M:%S",
)

logger = logging.getLogger("leetcode-service-logger")