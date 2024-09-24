from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required, verify_jwt_in_request
from .. import db_operations as dbo
from .. import db_ops_users as dbu
from functools import wraps

projects_bp = Blueprint('projects', __name__, static_folder='static', template_folder='templates')

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        uuid = get_jwt_identity()
        user = dbu.get_user(uuid)
        if not user:
            return jsonify({"success": False, "message": "Fant ikke bruker"}),404
        if not user.admin:
            return jsonify({"success": False, "message": "Du har ikke tilgang på denne funksjonen"})
        return func(*args, **kwargs)
    return wrapper

@projects_bp.route('/', methods=['GET'])
@jwt_required()
def projects():
    projects = dbo.get_all_projects()
    if projects:
        project_data = {}
        for project in projects:
            project_data[project.uid] = project.get_json()
        return jsonify({"success": True, "data": project_data})    
    return jsonify({"success": False, "message": "Ingen prosjekter opprettet"})

@projects_bp.route('/stats/', methods=['GET'])        
@admin_required
def stats():
    stats = dbo.get_db_stats()
    if stats:
        return jsonify({"success": True, "data": stats})
    return jsonify({"success": False, "message": "Fant ikke noe statistikk"})

@projects_bp.route('/new_project/', methods=['POST'])
@jwt_required()
def new_project():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"})
    project_number = data["projectNumber"].strip()
    project_name = data["projectName"].strip()
    project_description = data["projectDescription"]
            
    if dbo.check_for_existing_project_number(project_number):
        return jsonify({"success": False, "message": "Prosjektnummer finnes allerede."})
    else:
        new_project = dbo.new_project(project_number, project_name, project_description)
        if new_project is False:
            return jsonify({"success": False, "message": "Kunne ikke opprette nytt prosjekt"})
    return jsonify({"success": True, "data": new_project.get_json()})

@projects_bp.route('/search/<search_string>/', methods=['GET'])
def search_project(search_string: str):
    projects = dbo.search_projects(search_string)
    if projects:
        project_data = {}
        for project in projects:
            project_data[project.uid] = project.get_json()
        return jsonify({"success": True, "data": project_data})
    else:
        return jsonify({"success": True, "message": "No match found"})

@projects_bp.route('/delete_project/', methods=['DELETE'])
@admin_required
def delete_project():
    data = request.get_json()
    print(data)
    if data:
        project_uid = data['project_uid']
        deleted_project = dbo.delete_project(project_uid)
        if deleted_project:
            return jsonify({"success": True, "message": "Prosjekt slettet"})
        return jsonify({"success": False, "message": "Kunne ikke slette prosjekt"})
    return jsonify({"success": False, "message": "Mottok ingen data"})