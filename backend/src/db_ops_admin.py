from sqlalchemy import func, and_
from . import models, db
from flask_login import login_required
from . import globals

@login_required
def find_existing_user(email: str) -> bool:
    email = db.session.query(models.User).filter(models.User.email == email).first()
    if email:
        return True
    else:
        return False