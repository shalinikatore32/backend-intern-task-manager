# app/models.py
from datetime import datetime
from typing import Any, Dict

def user_doc(email: str, full_name: str | None, hashed_password: str, role: str) -> Dict[str, Any]:
    return {
        "email": email,
        "full_name": full_name,
        "hashed_password": hashed_password,
        "role": role,
        "created_at": datetime.utcnow(),
    }

def task_doc(owner_id: str, title: str, description: str | None, is_completed: bool) -> Dict[str, Any]:
    now = datetime.utcnow()
    return {
        "owner_id": owner_id,
        "title": title,
        "description": description,
        "is_completed": is_completed,
        "created_at": now,
        "updated_at": now,
    }
