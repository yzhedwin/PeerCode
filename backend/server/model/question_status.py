from typing import Union
from pydantic import BaseModel

class QuestionStatus(BaseModel):
    userID: str
    titleSlug: str
    description: Union[str, None] = None