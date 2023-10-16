from pydantic import BaseSettings


class Config(BaseSettings):
    # the following variables will read from env var
    pass


def get_config():
    return Config()
