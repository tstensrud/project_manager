from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity, verify_jwt_in_request
from .. import db_ops_users as dbo
from functools import wraps

user_bp = Blueprint('user',__name__)

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        uuid = get_jwt_identity()
        user = dbo.get_user(uuid)
        if not user:
            return jsonify({"success": False, "message": "Fant ikke bruker"}),404
        
        if not user.admin:
            return jsonify({"success": False, "message": "Du har ikke tilgang på denne funksjonen"})
        return func(*args, **kwargs)
    return wrapper

@user_bp.route('/', methods=['GET'])
@jwt_required()
def user_profile():
    verify_jwt_in_request()
    user_identity = get_jwt_identity()
    user = dbo.get_user(user_identity)
    if user:
        user_data = dbo.get_user_data(user_uid=user_identity)
        is_admin = user.admin
        if is_admin:
            return jsonify({"success": True, "data": user_data, "admin": "admin"})
        else:
            return jsonify({"success": True, "data": user_data})
    return jsonify({"success": False, "message": "Fant ikke bruker"})

@user_bp.route('/set_favourite/<project_uid>/', methods=['POST'])
@jwt_required()
def set_favourite_project(project_uid: str):
    verify_jwt_in_request()
    user_identity = get_jwt_identity()
    new_fav = dbo.set_fav_project(project_uid, user_identity)
    if new_fav:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Kunne ikke legge til favoritt"})

@user_bp.route('/remove_fav/<fav_uid>/', methods=['DELETE'])
@jwt_required()
def remove_fav_project(fav_uid: str):
    removed_fav = dbo.remove_fav_project(fav_uid)
    if removed_fav:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Kunne ikke slette favoritt"})

@user_bp.route('/change_password/', methods=['PATCH'])
@jwt_required()
def change_password():
    data = request.get_json()
    if data:
        new_password = data["new"]
        verify_jwt_in_request()
        user_identity = get_jwt_identity()
        user = dbo.get_user(user_identity)
        if user:
            updated_password = dbo.update_password(user_identity, new_password)
            if updated_password:
                return jsonify({"success": True, "message": "Passord oppdatert"})
            return jsonify({"success": False, "message": "Kunne ikke oppdatere passord"})
        return jsonify({"success": False, "message": "Fant ikke bruker"})
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
        new_user = dbo.register_new_user(name=name, email=email)
        if new_user:
            return jsonify({"success": True, "message": "Bruker lagt til"})
        return jsonify({"success": False, "message": "Kunne ikke legge til ny bruker"})
    return jsonify({"success": False, "message": "Mottok ingen ny brukerdata"})

@user_bp.route('/all_users/', methods=['GET'])
@admin_required
def get_all_users():
    users = dbo.get_users()
    if users:
        user_data = {}
        for user in users:
            user_data[user.uuid] = user.get_json()
        return jsonify({"success": True, "data": user_data})
    return jsonify({"success": False, "message": "No users found"})

@user_bp.route('/change_user_status/', methods=['PATCH'])
@admin_required
def change_user_status():
    data = request.get_json()
    if data:
        user_uid = data["user_uid"]
        deactivated_user = dbo.change_active_status(user_uid)
        if deactivated_user:
            return jsonify({"success": True, "message": "Brukerstatus endret"})
        return jsonify({"success": False, "message": "Kunne ikke deaktivere bruker"})
    return jsonify({"success": False, "message": "Ingen data mottatt"})
        
        
            
        
