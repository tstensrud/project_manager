from flask import Blueprint, redirect, jsonify, request, session
from flask_jwt_extended import jwt_required
from .. import models, db
from .. import db_operations as dbo
from markupsafe import escape

projects_bp = Blueprint('projects', __name__, static_folder='static', template_folder='templates')

@projects_bp.route('/', methods=['GET'])
@jwt_required()
def projects():
    projects_objects = dbo.get_all_projects()
    project_json_data = list(map(lambda x: x.get_json(), projects_objects))

    if project_json_data:
        return jsonify({"data": project_json_data})
    else:
        return jsonify({"data": "Ingen prosjekter opprettet"})
        

@projects_bp.route('/new_project/', methods=['POST'])
@jwt_required()
def new_project():
    print("Submitting new project")
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data received"})
    project_number = escape(data["projectNumber"])
    project_name = escape(data["projectName"])
    project_description = escape(data["projectDescription"])
            
    if dbo.check_for_existing_project_number(project_number):
        return jsonify({"data": "Prosjektnummer finnes allerede."})
    else:
        new_project = dbo.new_project(project_number, project_name, project_description)
        if new_project is False:
            return jsonify({"error": "Kunne ikke opprette nytt prosjekt"})
    return jsonify({"data": new_project.get_json()})