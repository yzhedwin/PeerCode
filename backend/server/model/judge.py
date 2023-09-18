from pydantic import BaseModel

class Judge(BaseModel):
    source_code: str
    language_id: int
    stdin: str