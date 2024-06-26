from flask import Blueprint, redirect, url_for, render_template, jsonify, flash, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import models, db
from .. import db_operations as dbo
from .. import globals
from markupsafe import escape

project_bp = Blueprint('project', __name__, static_folder='static', template_folder='templates')
globals.blueprint_setup(project_bp)

@project_bp.route('/<project_id>/', methods=['GET'])
@jwt_required()
def project(project_id):
    print(f"got endpoint id: {project_id}")
    project = dbo.get_project(project_id)
    if project is not None:
        print("Project was not none")
        total_area: float = dbo.summarize_project_area(project.id)
        project_data = project.get_json()
        print(project_data)
        return jsonify({"data": project_data})
    else:
        return jsonify({"data": "Fant ikke prosjekt"})

@project_bp.route('/settings', methods=['GET', 'POST'])
#@project_bp.route('/settings/<project_id>', methods=['GET', 'POST'])
@jwt_required()
def settings(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    specifications = dbo.get_specifications()
    if request.method == "GET":
        return render_template("project_settings.html",
                            user = current_user,
                            project = project,
                            specifications = specifications,
                            endpoint=endpoint,
                            project_id = project_id)
    
    elif request.method == "POST":
        new_project_number = escape(request.form.get("project_number").strip())
        new_project_name = escape(request.form.get("project_name").strip())
        new_project_description = escape(request.form.get("project_description"))
        new_specification_id = escape(request.form.get("project_specification"))
        if new_specification_id == "none":
            pass
        else:    
            specification = models.Specifications.query.filter_by(id=new_specification_id).first()
            project.specification = specification.name
        
        project.project_number = new_project_number
        project.project_name = new_project_name
        project.project_description = new_project_description
        

        db.session.commit()
        return redirect(url_for('project.project', project_id=project_id))

@project_bp.route('/reports', methods=['GET'])
@jwt_required()
def reports(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    return render_template('reports.html',
                           user=current_user,
                           project=project,
                           endpoint=endpoint,
                           project_id=project_id)


@project_bp.route('/new_todo_item', methods=['POST'])
@jwt_required()
def new_todo_item(project_id):
    if request.method == "POST":
        return_endpoint = request.referrer
        if return_endpoint:
            if request.is_json:
                data = request.get_json()
                user_id = escape(data["user_id"])
                content = escape(data["todo_content"])
                if dbo.new_todo_item(project_id, user_id, content):
                    response = {"success": True, "redirect": return_endpoint}
                else:
                    flash("Kunne ikke opprette punkt for huskeliste", category="error")
                    response = {"success": False, "redirect": return_endpoint}
        return jsonify(response)


@project_bp.route('/todo_item_complete', methods=['POST'])
@jwt_required()
def todo_item_complete(project_id):
    if request.method == "POST":
        return_endpoint = request.referrer
        if return_endpoint:
            if request.is_json:
                data = request.get_json()
                if dbo.set_todo_item_completed(escape(data["item_id"]), escape(data["user_id"])):
                    response = {"success": True, "redirect": return_endpoint}
                else:
                    flash("Kunne ikke markere punkt som utført", category="error")
                    response = {"success": False, "redirect": return_endpoint}
            
    return jsonify(response)