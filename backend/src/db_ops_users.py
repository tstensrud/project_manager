import string
import os
import secrets
import hashlib
import smtplib
from werkzeug.security import generate_password_hash
from uuid import uuid4
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from . import models, db
from . import globals

def generate_hashed_url_token(uuid: str):
    return hashlib.sha256(uuid.encode('utf-8')).hexdigest()

def verify_url_token(provided_token, stored_token):
    return generate_hashed_url_token(provided_token) == stored_token

def generate_token(length):
    chars = string.ascii_letters + string.digits
    password = ''.join(secrets.choice(chars) for i in range(length))
    return password

def send_registration_mail(email_adress: str, uuid: str) -> bool:
    subject = "Din brukerkonto i Structor TS"
    body = f"Gå inn på denne linken for å fullføre registreringen: https://tstensrud.github.io/project_manager/#/register/{uuid}"
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
        print("Email sent")
        return True
    except Exception as e:
        globals.log(f"Could not send email: {e}")
        return False


def initialize_new_user(name: str, email: str) -> str:
    uuid = globals.encode_uid_base64(uuid4())
    token = generate_hashed_url_token(uuid)
    timestamp = globals.timestamp()
    new_user_reg = models.NewUserRegistration(user_uid=uuid, token_hash=token, timestamp=timestamp)
    new_user = models.Users(uuid=uuid, name=name, email=email)
    try:
        db.session.add(new_user)
        db.session.add(new_user_reg)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not add new NewUserRegistration {e}")
        return None
    send_email = send_registration_mail(email, uuid)
    if send_email:
        return uuid
    return None

# Set password for first time upon registration
def set_new_user_password(password: str, uuid: str) -> bool:
    user = get_user(uuid)
    user.password = generate_password_hash(password, method='scrypt')
    new_user_record = get_new_register_record(uuid)
    if new_user_record:
        new_user_record.is_revoked = True
        user.is_active = True
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Could not set new password {e}")
        return False
    
def find_email(email: str) -> bool:
    email = db.session.query(models.Users).filter(models.Users.email == email).first()
    if email:
        return True
    return False

def get_new_register_record(uuid: str) -> models.NewUserRegistration:
    record = db.session.query(models.NewUserRegistration).filter(models.NewUserRegistration.user_uid == uuid).first()
    if record:
        return record
    return None


def get_user(user_uuid) -> models.Users:
    user = db.session.query(models.Users).filter(models.Users.uuid == user_uuid).first()
    return user

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