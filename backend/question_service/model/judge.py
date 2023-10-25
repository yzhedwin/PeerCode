from pydantic import BaseModel, Field
from typing import Union
import uuid

class JudgeInput(BaseModel):
    userID: str
    titleSlug: str
    source_code: str
    language_id: int
    stdin: Union[str, None]

class SubmissionStatus(BaseModel):
    id: int
    description: str

class JudgeOutput(BaseModel):
    stdout: str
    time: float
    memory: int
    stderr: Union[str, None]
    token: str 
    compile_output: Union[str, None]
    message: Union[str, None]
    status: SubmissionStatus
    finished_at: Union[str, None]

class Submission(BaseModel):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True, nullable=False)
    submission: JudgeInput
    feedback: JudgeOutput