import logging
from motor.motor_asyncio import AsyncIOMotorClient
from .mongodb import db
from config import get_config


async def connect_to_mongo():
    logging.info("Connecting to MongoDB...")
    config = get_config()
    db_uri = config.mongo_peercode_url
    db.client = AsyncIOMotorClient(str(db_uri))
    logging.info("MongoDB connected")
    logging.info("Creating database index")
    myDB = db.client[config.mongo_peercode_database_name]
    myDB["questions"].create_index("titleSlug", unique=True)
    myDB["solutions"].create_index("titleSlug", unique=True)
    logging.info("Created database index")


async def close_mongo_connection():
    logging.info("Closing MongoDB connection...")
    db.client.close()
    logging.info("MongoDB disconnected")
