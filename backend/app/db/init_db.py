from app.db.session import Base, engine


def init_db():
    """Create all tables."""
    from app.models import user, sermon, testimony, appointment, course, event  # noqa
    Base.metadata.create_all(bind=engine)
