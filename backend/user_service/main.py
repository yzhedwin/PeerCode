from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import get_config
from router import user_router

app = FastAPI()
config = get_config()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
        
@app.on_event("startup")
async def startup_event():
    #connect to mysql
    pass

@app.on_event("shutdown")
async def shutdown_event():
    # close mysql connection
    pass

@app.get("/")
def read_root():
    return {"message": "Hello World!"}
