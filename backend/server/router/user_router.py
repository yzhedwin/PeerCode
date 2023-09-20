from fastapi import APIRouter, Depends
from config import get_config
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
import requests
from model.user import UserLogin

router = APIRouter(
    prefix="/api/v1/user",
    tags=["user"],
    responses={404: {"description": "Not found"}},
)

config = get_config()
auth_scheme = HTTPBearer()

@router.get("/profile")
async def get_user_profile(token:HTTPAuthorizationCredentials= Depends(auth_scheme)):
    response = requests.get(config.user_service_url + "/profile", headers=({"authorization": f"Bearer ${token}"}))
    return response.json()

@router.post("/login")
async def login(user: UserLogin):
    response = requests.post(config.user_service_url + "/login", json=user.dict())
    return response.json()

@router.post("/register")
async def register():
    response = requests.get(config.user_service_url + "/register")
    return response