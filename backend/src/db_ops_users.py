from . import models, db
from . import globals
from werkzeug.security import generate_password_hash
from uuid import uuid4


def get_user(user_uuid) -> models.Users:
    user = db.session.query(models.Users).filter(models.Users.uuid == user_uuid).first()
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
    users = db.session.query(models.Users).all()
    return users

def set_fav_project(project_uid: str, uuid: str) -> bool:
    item_uuid = str(uuid4())
    fav = models.UserFavProjects(uid=item_uuid, project_uid=project_uid, user_uid=uuid)
    try:
        db.session.add(fav)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not add fav project {e}")
        return False

def remove_fav_project(fav_uid: str) -> bool:
    fav = db.session.query(models.UserFavProjects).filter(models.UserFavProjects.uid == fav_uid).first()
    print(fav)
    try:
        db.session.delete(fav)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Could not remove fav project {e}")
        db.session.rollback()
        return False

def get_fav_projects(uuid: str) -> list[models.UserFavProjects]:
    favs = db.session.query(models.UserFavProjects).filter(models.UserFavProjects.user_uid == uuid).all()
    if favs:
        return favs
    return None