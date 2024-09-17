from flask import Blueprint, redirect, jsonify, request, session
from flask_jwt_extended import jwt_required
from .. import models, db
from .. import db_operations as dbo
from markupsafe import escape

projects_bp = Blueprint('projects', __name__, static_folder='static', template_folder='templates')

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
        

@projects_bp.route('/new_project/', methods=['POST'])
@jwt_required()
def new_project():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"})
    project_number = escape(data["projectNumber"])
    project_name = escape(data["projectName"])
    project_description = escape(data["projectDescription"])
            
    if dbo.check_for_existing_project_number(project_number):
        return jsonify({"success": False, "message": "Prosjektnummer finnes allerede."})
    else:
        new_project = dbo.new_project(project_number, project_name, project_description)
        if new_project is False:
            return jsonify({"success": False, "message": "Kunne ikke opprette nytt prosjekt"})
    return jsonify({"success": True, "data": new_project.get_json()})