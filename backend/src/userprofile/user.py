from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from .. import db_ops_users as dbo

user_bp = Blueprint('user',__name__)

@user_bp.route('/', methods=['GET'])
@jwt_required()
def user_profile(uuid: str):
    user = dbo.get_user(uuid)
    if user:
        is_admin = user.admin
        if is_admin:
            admin_data = user.get_json()    
            return jsonify({"success": True, "data": admin_data})
        else:
            user_data = user.get_json()
            return jsonify({"success": True, "data": user_data})
    return jsonify({"success": False, "message": "Fant ikke bruker"})

@user_bp.route('/set_favourite/<project_uid>/', methods=['POST'])
def set_favourite_project(project_uid: str, uuid: str):
    new_fav = dbo.set_fav_project(project_uid, uuid)
    if new_fav:
        return jsonify({"success": True})
    else:
        return jsonify({"success": False, "message": "Kunne ikke legge til favoritt"})

@user_bp.route('/remove_fav/<fav_uid>/', methods=['DELETE'])
def remove_fav_project(uuid: str, fav_uid: str):
    removed_fav = dbo.remove_fav_project(fav_uid)
    if removed_fav:
        return jsonify({"success": True})
    return jsonify({"success": False, "message": "Kunne ikke slette favoritt"})

@user_bp.route('/get_favs/', methods=['GET'])
def get_fav_projects(uuid: str):
    favs = dbo.get_fav_projects(uuid)
    if favs:
        fav_data = {}
        for fav in favs:
            fav_data[fav.uid] = fav.get_json()
        return jsonify({"success": True, "data": fav_data})
    return jsonify({"success": False, "message": "Ingen favoritter lagt til"})


