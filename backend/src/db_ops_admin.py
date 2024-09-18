from sqlalchemy import func, and_
from . import models, db
from . import globals

def find_existing_user(email: str) -> bool:
    email = db.session.query(models.Users).filter(models.Users.email == email).first()
    if email:
        return True
    else:
        return False