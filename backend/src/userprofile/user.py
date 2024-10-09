from flask import Blueprint, jsonify, request
from .. import db_ops_users as dbo
from .. import db_ops_messages as dbm
from functools import wraps
from firebase_admin import auth
from .. import globals
import json

user_bp = Blueprint('user',__name__)

def admin_required(func):
    @wraps(func)
    @firebase_required
    def wrapper(*args, **kwargs):
        user_identity = request.user_uid
        user = dbo.get_user(user_identity)
        if not user:
            return jsonify({"success": False, "message": "Fant ikke bruker"}),404
        if not user.admin:
            return jsonify({"success": False, "message": "Du har ikke tilgang på denne funksjonen"})
        return func(*args, **kwargs)
    return wrapper

def firebase_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        if id_token is None:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        token = id_token.split(" ")[1]
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            uid = decoded_token['uid']
            request.user_uid = uid
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@user_bp.route('/all_users/', methods=['GET'])
@firebase_required
def get_all_users():
    users = dbo.get_users()
    if users:
        all_user_data = {}
        for user in users:
            firebase_data = None
            try:
                firebase_data = auth.get_user(user.uuid)
                user_data = {}
                user_data["firebase"] = {
                    'uid': firebase_data.uid,
                    'email': firebase_data.email,
                    'email_verified': firebase_data.email_verified,
                    'display_name': firebase_data.display_name,
                    'phone_number': firebase_data.phone_number,
                    'photo_url': firebase_data.photo_url,
                    'disabled': firebase_data.disabled,
                    'provider_data': [provider.__dict__ for provider in firebase_data.provider_data],
                    'custom_claims': firebase_data.custom_claims,
                    'creation_timestamp': firebase_data.user_metadata.creation_timestamp,
                    'last_sign_in_timestamp': firebase_data.user_metadata.last_sign_in_timestamp
                }
                user_data["server"] = user.get_json()
                all_user_data[user.uuid] = user_data
            except Exception as e:
                globals.log(f"Value error getting firebase user account: {e} ")
        return jsonify({"success": True, "data": all_user_data})
    return jsonify({"success": False, "message": "No users found"})

@user_bp.route('/<uuid>/', methods=['GET'])
@firebase_required
def user_profile(uuid):
    user = dbo.get_user(uuid)
    if user:
        user_data = {}
        user_data["server"] = dbo.get_user_data(user_uid=uuid)
        try:
            firebase_record = auth.get_user(uuid)
            user_data["firebase"] = {
                'uid': firebase_record.uid,
                'email': firebase_record.email,
                'email_verified': firebase_record.email_verified,
                'display_name': firebase_record.display_name,
                'phone_number': firebase_record.phone_number,
                'photo_url': firebase_record.photo_url,
                'disabled': firebase_record.disabled,
                'provider_data': [provider.__dict__ for provider in firebase_record.provider_data],
                'custom_claims': firebase_record.custom_claims,
                'creation_timestamp': firebase_record.user_metadata.creation_timestamp,
                'last_sign_in_timestamp': firebase_record.user_metadata.last_sign_in_timestamp
            }
        except Exception as e:
            globals.log(f"Could not retrieve firebase user data {e}")
            return jsonify({"success": False, "message": "Kunne ikke finne brukerdata"})
        is_admin = user.admin
        if is_admin:
            return jsonify({"success": True, "data": user_data, "admin": "admin"})
        else:
            return jsonify({"success": True, "data": user_data})
    return jsonify({"success": False, "message": "Fant ikke bruker"})

@user_bp.route('/set_favourite/<project_uid>/', methods=['POST'])
@firebase_required
def set_favourite_project(project_uid: str):
    user_identity = request.user_uid
    if user_identity:
        new_fav = dbo.set_fav_project(project_uid, user_identity)
        if new_fav:
            return jsonify({"success": True})
        else:
            return jsonify({"success": False, "message": "Kunne ikke legge til favoritt"})
    return jsonify({"success": False, "message": "User not found"})

@user_bp.route('/is_favourite/<project_uid>/', methods=['GET'])
@firebase_required
def is_project_favourite(project_uid: str):
    user_identity = request.user_uid
    if user_identity:
        fav_projects = dbo.get_fav_projects(user_identity)
        if fav_projects:
            is_fav = False
            for fav in fav_projects:
                if fav.project_uid == project_uid:
                    is_fav = True
                    break
            return jsonify({"success": True, "data": is_fav})
        return jsonify({"success": False, "message": "Ingen favoritter satt"})
    return jsonify({"success": False, "message": "User not found"})

@user_bp.route('/remove_fav/<fav_uid>/', methods=['DELETE'])
@firebase_required
def remove_fav_project(fav_uid: str):
    removed_fav = dbo.remove_fav_project(fav_uid)
    if removed_fav:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Kunne ikke slette favoritt"})

###################
# MESSAGING       #
###################
@user_bp.route('/inbox/<uuid>/', methods=['GET'])
@firebase_required
def inbox(uuid: str):
    messages = dbm.get_inbox(uuid)
    if messages:
        message_data = {}
        for message, user in messages:
            current_message = {
                "messageData": message.get_json(),
                "userData": user.get_json()
            }
            message_data[message.uid] = current_message
        return jsonify({"success": True, "data": message_data})
    return jsonify({"success": False, "message": "Innboksen er tom"})

@user_bp.route('/new_message/', methods=['POST'])
def new_message():
    data = request.get_json()
    if data:
        sender_uid = data["uuid"]
        recipient_uuid = data["recipient_uuid"]
        recipient_user = dbo.get_user(recipient_uuid)
        if not recipient_user:
            return jsonify({"success": False, "message": "Fant ikke mottakers epost"})    
        message = data["message"]
        new_message = dbm.new_message(sender_uuid=sender_uid, receiver_uuid=recipient_uuid, message=message)
        if new_message:
            return jsonify({"success": True, "message": "Melding sendt"})
        return jsonify({"success": False, "message": "Kunne ikke sende melding"})
    return jsonify({"success": False, "message": "Mottok ingen data"})

@user_bp.route('/sent/<uuid>/', methods=['GET'])
@firebase_required
def get_sent_messages(uuid: str):
    messages = dbm.get_sent_messages(uuid)
    if messages:
        message_data = {}
        for message, user in messages:
            current_message = {
                "messageData": message.get_json(),
                "userData": user.get_json()
            }
            message_data[message.uid] = current_message
        return jsonify({"success": True, "data": message_data})
    return jsonify({"success": False, "message": "Ingen sendte meldinger."})

@user_bp.route('/archive/<uuid>/', methods=['GET'])
@firebase_required
def get_archive(uuid: str):
    messages = dbm.get_archive(uuid)
    if messages:
        message_data = {}
        for message, user in messages:
            current_message = {
                "messageData": message.get_json(),
                "userData": user.get_json()
            }
            message_data[message.uid] = current_message
        return jsonify({"success": True, "data": message_data})
    return jsonify({"success": False, "message": "Ingen meldinger i arkiv"})

@user_bp.route('/markasread/', methods=['PATCH'])
@firebase_required
def mark_message_read():
    data = request.get_json()
    if data:
        msg_uid = data["msgUid"]
        read_status = data["read"]
        marked_as_read = dbm.change_message_read_status(msg_uid=msg_uid, status=read_status)
        if marked_as_read:
            return jsonify({"success": True})
        return jsonify({"success": False, "message": "Feil i merking av melding som lest"})
    return jsonify({"success": False, "message": "Mottok ingen data"})

@user_bp.route('/delete_msg/', methods=['DELETE'])
@firebase_required
def delete_message():
    data = request.get_json()
    if data:
        msg_uid = data["msgUid"]
        deleted_message = dbm.delete_message(msg_uid=msg_uid)
        if deleted_message:
            return jsonify({"success": True})
        return jsonify({"success": False, "message": "Kunne ikke slette melding"})
    return jsonify({"success": False, "message": "Mottok ingen data"})


###################
# ADMIN ENDPOINTS #
###################
@user_bp.route('/new_user/', methods=['POST'])
@admin_required
def register_new_user():
    data = request.get_json()
    if data:
        email = data["email"].strip()
        existing_email = dbo.find_email(email)
        
        if existing_email:
            return jsonify({"success": False, "message": "E-post er allerede registrert"})
        
        name = data["name"].strip()
        new_user = dbo.create_new_user(name=name, email=email)

        if new_user is not None:
            return jsonify({"success": True, "message": "Bruker lagt til", "data": new_user})
        return jsonify({"success": False, "message": "Kunne ikke legge til ny bruker"})
    return jsonify({"success": False, "message": "Mottok ingen ny brukerdata"})


@user_bp.route('/change_user_status/', methods=['PATCH'])
@admin_required
def change_user_status():
    data = request.get_json()
    if data and "user_uid" in data:
        user_uid = data["user_uid"]
        firebase_user = auth.get_user(user_uid)
        user_status = firebase_user.disabled
        print(user_status)
        try:
            updated_user = auth.update_user(
                user_uid,
                disabled=not user_status
            )
            return jsonify({"success": True, "message": "Brukerstatus endret"})
        except Exception as e:
            print(f"Could not change users status {e}")
            return jsonify({"success": False, "message": "Kunne ikke deaktivere bruker"})
    return jsonify({"success": False, "message": "Ingen data mottatt"})
        
@user_bp.route('/delete_user/', methods=['DELETE'])
@admin_required
def delete_user():
    data = request.get_json()
    if data:
        user_uid = data['user_uid']
        deleted_user = dbo.delete_user(user_uid)
        if deleted_user:
            return jsonify({"success": True, "message": "Bruker slettet"})
        return jsonify({"success": False, "message": "Kunne ikke slette bruker"})
    return jsonify({"success": False, "message": "Mottok ingen data"})
