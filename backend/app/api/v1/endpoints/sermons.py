from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.schemas.sermon import SermonResponse, SermonCreate, SermonUpdate, SermonCategoryResponse, SermonCategoryCreate
from app.models.sermon import Sermon, SermonCategory
from app.core.security import require_admin_or_team_lead

router = APIRouter()


@router.get("/", response_model=List[SermonResponse])
async def get_sermons(
    skip: int = 0,
    limit: int = 20,
    category: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Sermon).filter(Sermon.is_published == True)
    
    if category:
        query = query.join(SermonCategory).filter(SermonCategory.slug == category)
    
    if search:
        query = query.filter(Sermon.title.ilike(f"%{search}%"))
    
    sermons = query.order_by(Sermon.created_at.desc()).offset(skip).limit(limit).all()
    return sermons


@router.get("/{sermon_id}", response_model=SermonResponse)
async def get_sermon(sermon_id: int, db: Session = Depends(get_db)):
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise HTTPException(status_code=404, detail="Sermon not found")
    
    # Increment view count
    sermon.view_count += 1
    db.commit()
    
    return sermon


@router.post("/", response_model=SermonResponse)
async def create_sermon(
    sermon_data: SermonCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    sermon = Sermon(**sermon_data.dict())
    db.add(sermon)
    db.commit()
    db.refresh(sermon)
    return sermon


@router.put("/{sermon_id}", response_model=SermonResponse)
async def update_sermon(
    sermon_id: int,
    sermon_data: SermonUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise HTTPException(status_code=404, detail="Sermon not found")
    
    for field, value in sermon_data.dict(exclude_unset=True).items():
        setattr(sermon, field, value)
    
    db.commit()
    db.refresh(sermon)
    return sermon


@router.delete("/{sermon_id}")
async def delete_sermon(
    sermon_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    sermon = db.query(Sermon).filter(Sermon.id == sermon_id).first()
    if not sermon:
        raise HTTPException(status_code=404, detail="Sermon not found")
    
    db.delete(sermon)
    db.commit()
    return {"message": "Sermon deleted successfully"}


# Categories
@router.get("/categories/", response_model=List[SermonCategoryResponse])
async def get_categories(db: Session = Depends(get_db)):
    categories = db.query(SermonCategory).all()
    return categories


@router.post("/categories/", response_model=SermonCategoryResponse)
async def create_category(
    category_data: SermonCategoryCreate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    category = SermonCategory(**category_data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category
