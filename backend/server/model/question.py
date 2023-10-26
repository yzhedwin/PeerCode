from typing import Union
from pydantic import BaseModel
from config import get_config

config = get_config()
class Question(BaseModel):
    title: str
    titleSlug: str
    topicTags: Union[list, None] = None
    hasSolution: Union[bool, None] = None
    hasVideoSolution: Union[bool, None] = None
    acRate: Union[float, None] = None
    difficulty: Union[str, None] = None
    status: Union[str, None] = None
    problem: Union[str, None] = None

    
