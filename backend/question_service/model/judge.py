from pydantic import BaseModel, Field
from typing import Union
import uuid


class JudgeInput(BaseModel):
    userID: str
    titleSlug: str
    source_code: str
    language_id: int
    stdin: Union[str, None]
    expected_output: Union[str, None]


class SubmissionStatus(BaseModel):
    id: int
    description: Union[str, None] = None


class JudgeOutput(BaseModel):
    token: str
    stdout: Union[str, None] = None
    time: Union[float, None] = None
    memory: Union[int, None] = None
    stderr: Union[str, None] = None
    compile_output: Union[str, None] = None
    message: Union[str, None] = None
    status: Union[SubmissionStatus, None] = None
    finished_at: Union[str, None] = None


class Submission(BaseModel):
    id: Union[str, uuid.UUID] = uuid.UUID
    submission: Union[JudgeInput, None] = None
    feedback: Union[JudgeOutput, None] = None
