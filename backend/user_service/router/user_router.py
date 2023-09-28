from fastapi import APIRouter, Depends, HTTPException, status, Header
from config import get_config
from typing import Annotated
from fastapi.security import HTTPBearer,HTTPAuthorizationCredentials
from model.user import UserLogin

auth_scheme = HTTPBearer()

router = APIRouter(
    prefix="/api/v1/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

config = get_config()

@router.get("/profile")
async def get_user_profile(token:HTTPAuthorizationCredentials= Depends(auth_scheme)):
    #TODO: check token is valid with mysql
    print(token)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"authorization": "Bearer"},
        )
    return {"firstName": "user"}

@router.post("/login")
async def login(user: UserLogin):
    #TODO: get token from mysql or firebase here
    return {"userToken":"abcdefg"}

@router.post("/register")
async def register():
    #TODO: register user to database
    #Define user model
    pass