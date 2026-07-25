from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from model import UserQuery
from firestore_service import createuserinquiry

app = FastAPI(title="Piper Software Solutions LLC API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"status": "Piper Software Solutions LLC API is active"}

@app.post("/api/inquiry")
async def posttofirestore(userquery: UserQuery):
    try:
        user_dict = userquery.model_dump()
        saved_query = createuserinquiry(user_dict)
        return {
            "message": "Thank you for your inquiry! We will get back to you soon.",
            "status": "success",
            "id": saved_query.get("id")
        }
    except Exception as e:
        print(f"Error saving query: {str(e)}")
        return {"message": f"Internal server error: {str(e)}", "status": "error"}
