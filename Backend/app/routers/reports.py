from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.database import get_db
from app.models.category import Category
from app.models.user import User
from app.utils.auth import get_current_user


router = APIRouter(
    prefix="/reports",
    tags=["Reports"]
)


@router.get("/categories")
async def get_categories(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    result = await db.execute(
        select(Category).order_by(Category.category_id)
    )

    categories = result.scalars().all()

    return [
        {
            "category_id": c.category_id,
            "name": c.name,
            "description": c.description,
        }
        for c in categories
    ]
