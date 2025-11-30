# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from bson import ObjectId
from ..database import get_db
from ..schemas import UserCreate, UserPublic, Token
from ..auth import hash_password, verify_password, create_access_token
from ..deps import get_current_user
from ..models import user_doc

router = APIRouter(prefix="/api/v1/auth", tags=["auth"])


# ---------- REGISTER USER ----------
@router.post("/register", response_model=UserPublic, status_code=status.HTTP_201_CREATED)
async def register_user(user_in: UserCreate, db=Depends(get_db)):

    # Check if email already exists
    existing = await db["users"].find_one({"email": user_in.email})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")

    # 🔐 Assign secure default role
    role = "user"

    doc = user_doc(
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hash_password(user_in.password),
        role=role,
    )

    result = await db["users"].insert_one(doc)

    return UserPublic(
        id=str(result.inserted_id),
        email=user_in.email,
        full_name=user_in.full_name,
        role=role,
    )


# ---------- LOGIN ----------
@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), db=Depends(get_db)
):
    user = await db["users"].find_one({"email": form_data.username})

    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Incorrect email or password")

    # Include role in token
    access_token = create_access_token(
        data={"sub": str(user["_id"]), "role": user["role"]}
    )

    return Token(access_token=access_token)


# ---------- GET ME ----------
@router.get("/me", response_model=UserPublic)
async def get_me(current_user: UserPublic = Depends(get_current_user)):
    return current_user
