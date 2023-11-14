from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_config
from router import question_router,question_status_router
from database.mongodb_utils import connect_to_mongo, close_mongo_connection
import asyncio
from leetcode_service import question_bank_consume, question_bank_consumer

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
app.include_router(question_status_router.router)
        
@app.on_event("startup")
async def startup_event():
    try:
        await connect_to_mongo()
        await question_bank_consumer.start()
        global question_bank_consumer_task
        question_bank_consumer_task = asyncio.create_task(question_bank_consume())
    except Exception as e:
        print(e)


@app.on_event("shutdown")
async def shutdown_event():
    await close_mongo_connection()
    question_bank_consumer_task.cancel()
    await question_bank_consumer.stop()

@app.get("/")
def read_root():
    return {"message": "Hello World!"}
