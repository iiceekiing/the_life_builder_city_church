from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.schemas.schemas import TestimonyResponse, TestimonyCreate, TestimonyUpdate
from app.models.testimony import Testimony
from app.core.security import require_admin_or_team_lead

router = APIRouter()


@router.get("/", response_model=List[TestimonyResponse])
async def get_testimonies(
    skip: int = 0,
    limit: int = 20,
    featured_only: bool = False,
    status_filter: str = "approved",
    db: Session = Depends(get_db)
):
    query = db.query(Testimony).filter(Testimony.status == status_filter)
    
    if featured_only:
        query = query.filter(Testimony.is_featured == True)
    
    testimonies = query.order_by(Testimony.created_at.desc()).offset(skip).limit(limit).all()
    return testimonies


@router.post("/", response_model=TestimonyResponse)
async def create_testimony(testimony_data: TestimonyCreate, db: Session = Depends(get_db)):
    testimony = Testimony(**testimony_data.dict())
    db.add(testimony)
    db.commit()
    db.refresh(testimony)
    return testimony


@router.put("/{testimony_id}", response_model=TestimonyResponse)
async def update_testimony(
    testimony_id: int,
    testimony_data: TestimonyUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    testimony = db.query(Testimony).filter(Testimony.id == testimony_id).first()
    if not testimony:
        raise HTTPException(status_code=404, detail="Testimony not found")
    
    for field, value in testimony_data.dict(exclude_unset=True).items():
        setattr(testimony, field, value)
    
    db.commit()
    db.refresh(testimony)
    return testimony


@router.delete("/{testimony_id}")
async def delete_testimony(
    testimony_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(require_admin_or_team_lead)
):
    testimony = db.query(Testimony).filter(Testimony.id == testimony_id).first()
    if not testimony:
        raise HTTPException(status_code=404, detail="Testimony not found")
    
    db.delete(testimony)
    db.commit()
    return {"message": "Testimony deleted successfully"}
