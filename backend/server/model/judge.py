from pydantic import BaseModel
from typing import Union


class Judge(BaseModel):
    source_code: str
    language_id: int
    stdin: Union[str, None]