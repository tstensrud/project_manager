import smtplib
import string
import os
import secrets
from firebase_admin import auth
from uuid import uuid4
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from . import models, db
from . import globals


def generate_password(length: int) -> str:
    chars = string.ascii_letters + string.digits + string.punctuation
    password = ''.join(secrets.choice(chars) for i in range(length))
    return password

def send_registration_mail(email_adress: str, uuid: str, password: str) -> bool:
    subject = "Din brukerkonto i Structor TS"
    body = f"Du er registrert i Structor TS sitt beregningsprogram for VVS.\nDitt passord er {password}.\nDu kan bytte dette ved å nullstille passord etter innlogging.\nhttps://tstensrud.github.io/project_manager/"
    sender_email = os.getenv('EMAIL')
    password = os.getenv('MAIL_PASSWORD')
    message = MIMEMultipart()
    
    message['From'] = sender_email
    message['To'] = email_adress
    message['Subject'] = subject
    message.attach(MIMEText(body, 'plain'))

    smtp_server = "smtp.office365.com"
    smtp_port = 587

    try:
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()
        server.login(user=sender_email, password=password)
        server.sendmail(sender_email, email_adress, message.as_string())
        server.quit()
        return True
    except Exception as e:
        globals.log(f"Could not send email: {e}")
        return False

def create_new_user(name: str, email: str) -> bool:
    if name and email:
        try:
            password = generate_password(10)
            new_firebase_user = auth.create_user(
                email=email,
                email_verified=False,
                password=password,
                display_name=name,
                photo_url=None,
                disabled=False
            )
        except Exception as e:
            globals.log(f"Could not create firebase user: {e}")
            return False
        if new_firebase_user:
            new_user = models.Users(uuid=new_firebase_user.uid, name=name, email=email)
        try:
            db.session.add(new_user)
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            globals.log(f"Could not add new new user {e}")
            return None
        send_registration_mail(email_adress=email, uuid=new_firebase_user.uid, password=password)
    return False
    
def find_email(email: str) -> bool:
    email = db.session.query(models.Users).filter(models.Users.email == email).first()
    if email:
        return True
    return False

def get_user(user_uuid) -> models.Users:
    user = db.session.query(models.Users).filter(models.Users.uuid == user_uuid).first()
    return user

def get_user_by_email(email: str) -> models.Users:
    user = db.session.query(models.Users).filter(models.Users.email == email).first()
    if user:
        return user
    return None

def get_user_data(user_uid) -> dict:
    user = get_user(user_uuid=user_uid)
    if user:
        user_data = {}
        user_json = user.get_json()
        user_favs = get_fav_projects(user_uid)
        fav_uids={}
        if user_favs:
            for fav in user_favs:
                fav_uids[fav.uid] = fav.get_json()
        user_data = {
            "user_info": user_json,
            "user_favs": fav_uids
        }
        
        return user_data
    return {}

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

def delete_user(uuid: str) -> bool:
    user = get_user(uuid)
    if user:
        try:
            db.session.delete(user)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            globals.log(f"Could not delete user {e}")
            return False
    return False