from . import models, db
from . import globals
from flask_login import login_required
from werkzeug.security import generate_password_hash


@login_required
def get_user(user_id) -> models.User:
    user = db.session.query(models.User).filter(models.User.id == user_id).first()
    return user

@login_required
def update_password(user_id: int, password: str) -> bool:
    user = get_user(user_id)
    user.password = generate_password_hash(password, method='scrypt')
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Failed update password: {e}")
        return False

@login_required
def get_users():
    users = db.session.query(models.User).all()
    return users