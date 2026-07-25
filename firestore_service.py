import firebase_admin
from firebase_admin import credentials, firestore
import os
import uuid
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, "key.json")

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
    # Explicitly generate a unique document ID for every inquiry
    inquiry_id = f"inquiry_{uuid.uuid4().hex[:12]}"
    
    # Add id and timestamp into the saved document
    payload = {
        "id": inquiry_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **userinquiry
    }
    
    # Save as a distinct new document in Firestore
    doc_ref = db.collection(Collection_Name).document(inquiry_id)
    doc_ref.set(payload)
    
    return payload
