from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from confluent_kafka.admin import AdminClient, NewTopic, KafkaError
from config import get_config

from router import question_router, judge_router,question_status_router

app = FastAPI()
config = get_config()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(question_router.router)
app.include_router(judge_router.router)
app.include_router(question_status_router.router)

@app.on_event("startup")
async def startup_event():
    admin_client = AdminClient({"bootstrap.servers": config.kafka_server_name})
    topic_list = config.kafka_topics.split(",")
    kafka_topic_list = []
    for topic in topic_list:
        new_topic = NewTopic(topic, 1, 1)
        kafka_topic_list.append(new_topic)

    fs = admin_client.create_topics(kafka_topic_list)

    for topic, f in fs.items():
        try:
            print("Topic {} created".format(topic))
        except Exception as e:
            if e.args[0].code() == KafkaError.TOPIC_ALREADY_EXISTS:
                print("Topic {} already created".format(topic))
            else:
                print("Failed to create topic {}: {}".format(topic, e))


@app.on_event("shutdown")
async def shutdown_event():
    pass


@app.get("/")
def read_root():
    return {"message": "Hello World!"}
