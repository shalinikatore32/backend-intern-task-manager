# app/schemas.py
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime

# ---------- AUTH / USER SCHEMAS ----------

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: str
    role: str

class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

# UserCreate no longer accepts role from frontend
class UserCreate(UserBase):
    password: str


# Public safe version of user returned to client
class UserPublic(UserBase):
    id: str
    role: str  # role is still part of the public response


# ---------- TASK SCHEMAS ----------

class TaskBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=100)
    description: Optional[str] = Field(None, max_length=500)
    is_completed: bool = False

class TaskCreate(TaskBase):
    pass

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    is_completed: Optional[bool] = None

class TaskPublic(TaskBase):
    id: str
    owner_id: str
    created_at: datetime
    updated_at: datetime
