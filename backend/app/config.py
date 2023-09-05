from pydantic import BaseSettings

class Config(BaseSettings):
    # the following variables will read from env var
    mongo_peeps_host_name: str
    mongo_peeps_database_name: str
    mongo_peeps_database_user: str
    mongo_peeps_database_password: str
    server_port: str
    kafka_server_name: str
    kafka_topics: str
    kafka_group_server: str

def get_config():
    return Config()