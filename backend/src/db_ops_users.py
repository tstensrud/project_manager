from . import models, db
from . import globals
from werkzeug.security import generate_password_hash


def get_user(user_uuid) -> models.User:
    user = db.session.query(models.User).filter(models.User.uuid == user_uuid).first()
    return user

def update_password(user_uuid: int, password: str) -> bool:
    user = get_user(user_uuid)
    user.password = generate_password_hash(password, method='scrypt')
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Failed update password: {e}")
        return False

def get_users():
    users = db.session.query(models.User).all()
    return users