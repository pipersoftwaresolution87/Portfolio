import firebase_admin
from firebase_admin import credentials, firestore
import os
import json
import uuid
from datetime import datetime, timezone

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KEY_PATH = os.path.join(BASE_DIR, "key.json")
ALT_KEY_PATH = os.path.join(BASE_DIR, "portfolio.json")

def get_DB():
    if not firebase_admin._apps:
        # 1. Try Environment Variable (for cloud deployment like Render/Railway)
        env_credentials = os.getenv("FIREBASE_CREDENTIALS_JSON")
        if env_credentials:
            cred_dict = json.loads(env_credentials)
            cred = credentials.Certificate(cred_dict)
        elif os.path.exists(KEY_PATH):
            cred = credentials.Certificate(KEY_PATH)
        elif os.path.exists(ALT_KEY_PATH):
            cred = credentials.Certificate(ALT_KEY_PATH)
        else:
            raise FileNotFoundError(
                "No Firebase service account key found. Provide FIREBASE_CREDENTIALS_JSON env var or key.json"
            )
        
        firebase_admin.initialize_app(cred)
    
    return firestore.client()

db = get_DB()
Collection_Name = "userinquiries"

def createuserinquiry(userinquiry: dict) -> dict:
    inquiry_id = f"inquiry_{uuid.uuid4().hex[:12]}"
    payload = {
        "id": inquiry_id,
        "created_at": datetime.now(timezone.utc).isoformat(),
        **userinquiry
    }
    doc_ref = db.collection(Collection_Name).document(inquiry_id)
    doc_ref.set(payload)
    return payload
