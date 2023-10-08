from motor.motor_asyncio import AsyncIOMotorClient
from config import get_config

config = get_config()


class DataBase:
    client: AsyncIOMotorClient = None


db = DataBase()


async def get_database() -> AsyncIOMotorClient:
    return db.client[config.mongo_peercode_database_name]
