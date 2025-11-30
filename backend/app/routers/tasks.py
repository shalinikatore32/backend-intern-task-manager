# app/routers/tasks.py

from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime
from ..database import get_db
from ..schemas import TaskCreate, TaskPublic, TaskUpdate, UserPublic
from ..deps import get_current_user, require_admin
from ..models import task_doc

router = APIRouter(prefix="/api/v1/tasks", tags=["tasks"])


def to_task_public(doc) -> TaskPublic:
    return TaskPublic(
        id=str(doc["_id"]),
        owner_id=doc["owner_id"],
        title=doc["title"],
        description=doc.get("description"),
        is_completed=doc["is_completed"],
        created_at=doc["created_at"],
        updated_at=doc["updated_at"],
    )


# ------------------ CREATE TASK ------------------
@router.post("/", response_model=TaskPublic, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db=Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    doc = task_doc(
        owner_id=current_user.id,
        title=task_in.title,
        description=task_in.description,
        is_completed=task_in.is_completed,
    )

    result = await db["tasks"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return to_task_public(doc)


# ------------------ LIST MY TASKS ------------------
@router.get("/", response_model=List[TaskPublic])
async def list_my_tasks(
    db=Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    cursor = db["tasks"].find({"owner_id": current_user.id}).sort("created_at", -1)
    return [to_task_public(doc) async for doc in cursor]


# ------------------ ADMIN: LIST ALL TASKS ------------------
@router.get("/admin/all", response_model=List[TaskPublic])
async def list_all_tasks_admin(
    db=Depends(get_db),
    admin_user: UserPublic = Depends(require_admin),
):
    cursor = db["tasks"].find({}).sort("created_at", -1)
    return [to_task_public(doc) async for doc in cursor]


# ------------------ GET SINGLE TASK ------------------
@router.get("/{task_id}", response_model=TaskPublic)
async def get_task(
    task_id: str,
    db=Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    try:
        _id = ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    doc = await db["tasks"].find_one({"_id": _id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")

    if doc["owner_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    return to_task_public(doc)


# ------------------ UPDATE TASK ------------------
@router.put("/{task_id}", response_model=TaskPublic)
async def update_task(
    task_id: str,
    task_in: TaskUpdate,
    db=Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    try:
        _id = ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    doc = await db["tasks"].find_one({"_id": _id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")

    if doc["owner_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    update_data = {k: v for k, v in task_in.dict(exclude_unset=True).items()}
    update_data["updated_at"] = datetime.utcnow()

    await db["tasks"].update_one({"_id": _id}, {"$set": update_data})
    updated = await db["tasks"].find_one({"_id": _id})

    return to_task_public(updated)


# ------------------ DELETE TASK ------------------
@router.delete("/{task_id}", status_code=status.HTTP_200_OK)
async def delete_task(
    task_id: str,
    db=Depends(get_db),
    current_user: UserPublic = Depends(get_current_user),
):
    try:
        _id = ObjectId(task_id)
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")

    doc = await db["tasks"].find_one({"_id": _id})
    if not doc:
        raise HTTPException(status_code=404, detail="Task not found")

    if doc["owner_id"] != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not allowed")

    await db["tasks"].delete_one({"_id": _id})
    return {"message": "Task deleted successfully"}
