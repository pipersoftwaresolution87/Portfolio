import firebase_admin
from firebase_admin import credentials, firestore
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, "portfolio.json")

def get_DB():
    if not os.path.exists(KEY_PATH):
        raise FileNotFoundError(f"Service account file not found at {KEY_PATH}")
    
    if not firebase_admin._apps:
        cred = credentials.Certificate(KEY_PATH)
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

db = get_DB()
Collection_Name = "userinquires"

def createuserinquiry(userinquiry: dict) -> dict:
    collection_ref = db.collection(Collection_Name)
    # collection_ref.add() returns a tuple: (update_time, doc_ref)
    update_time, doc_ref = collection_ref.add(userinquiry)
    return {
        "id": doc_ref.id,
        **userinquiry
    }
