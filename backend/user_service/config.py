from pydantic import BaseSettings
from confluent_kafka import Consumer, OFFSET_END, Producer


class Config(BaseSettings):
    # the following variables will read from env var
    pass


def get_config():
    return Config()
