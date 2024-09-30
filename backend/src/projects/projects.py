from flask import Blueprint, jsonify, request
from .. import db_operations as dbo
from .. import db_ops_users as dbu
from firebase_admin import auth
from functools import wraps

projects_bp = Blueprint('projects', __name__, static_folder='static', template_folder='templates')

def admin_required(func):
    @wraps(func)
    @firebase_required
    def wrapper(*args, **kwargs):
        user_identity = request.user_uid
        user = dbu.get_user(user_identity)
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
        #print(f"ID token received: {id_token}")
        if id_token is None:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        token = id_token.split(" ")[1]
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            uid = decoded_token['uid']
            request.user_uid = uid
            #print(f"UID: {uid}")
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function

@projects_bp.route('/', methods=['GET'])
@firebase_required
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
@firebase_required
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