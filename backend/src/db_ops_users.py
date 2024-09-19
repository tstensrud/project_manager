from . import models, db
from . import globals
from werkzeug.security import generate_password_hash
from uuid import uuid4
import string
import secrets

def generate_password():
    length = 10
    chars = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(chars) for i in range(length))
    return password

def find_email(email: str) -> bool:
    email = db.session.query(models.Users).filter(models.Users.email == email).first()
    if email:
        return True
    return False

def register_new_user(name: str, email: str):
    password = generate_password_hash(generate_password(), method='scrypt')
    uuid = globals.encode_uid_base64(uuid4())
    new_user = models.Users(uuid=uuid, email=email, password=password, name=name)
    try:
        db.session.add(new_user)
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not add new user {e}")
        return False

def get_user(user_uuid) -> models.Users:
    user = db.session.query(models.Users).filter(models.Users.uuid == user_uuid).first()
    return user

def get_user_data(user_uid) -> dict:
    user = get_user(user_uuid=user_uid)
    if user:
        user_data = {}
        user_json = user.get_json()
        user_favs = get_fav_projects(user_uid)
        if user_favs:
            fav_uids={}
            for fav in user_favs:
                fav_uids[fav.uid] = fav.get_json()
        user_data = {
            "user_info": user_json,
            "user_favs": fav_uids
        }
        
        return user_data
    return {}

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

def get_users() -> list[models.Users]:
    users = db.session.query(models.Users).all()
    if users:
        return users
    return None

def change_active_status(uuid: str) -> bool:
    user = get_user(uuid)
    if user:
        user.is_active = not user.is_active
        try:
            db.session.commit()
            return True
        except Exception as e:
            globals.log(f"Could not deactivate user: {e}")
            db.session.rollback()
            return False
    return False

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