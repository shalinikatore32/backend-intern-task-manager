# app/deps.py

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from bson import ObjectId
from .auth import decode_access_token
from .database import get_db
from .schemas import UserPublic

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")


async def get_current_user(token: str = Depends(oauth2_scheme), db=Depends(get_db)):
    # Decode token
    token_data = decode_access_token(token)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
        )

    user = await db["users"].find_one({"_id": ObjectId(token_data.user_id)})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserPublic(
        id=str(user["_id"]),
        email=user["email"],
        full_name=user.get("full_name"),
        role=user["role"],
    )


async def require_admin(current_user: UserPublic = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN, 
            detail="Admin access required"
        )
    return current_user
