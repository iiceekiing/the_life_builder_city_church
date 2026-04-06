from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, sermons, testimonies, appointments, courses, events, content, admin

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(sermons.router, prefix="/sermons", tags=["sermons"])
api_router.include_router(testimonies.router, prefix="/testimonies", tags=["testimonies"])
api_router.include_router(appointments.router, prefix="/appointments", tags=["appointments"])
api_router.include_router(courses.router, prefix="/courses", tags=["courses"])
api_router.include_router(events.router, prefix="/events", tags=["events"])
api_router.include_router(content.router, prefix="/content", tags=["content"])
api_router.include_router(admin.router, prefix="/admin", tags=["admin"])
