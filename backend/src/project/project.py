from flask import Blueprint, redirect, url_for, render_template, jsonify, flash, g, request
from flask_login import login_required, current_user
from .. import models, db
from .. import db_operations as dbo
from .. import globals
from markupsafe import escape

project_bp = Blueprint('project', __name__, static_folder='static', template_folder='templates')
globals.blueprint_setup(project_bp)

@project_bp.route('/', methods=['GET', 'POST'])
@login_required
def project(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    if project != "none" and project is not None:
        total_area: float = dbo.summarize_project_area(project.id)
        return render_template("project.html", 
                            user=current_user, 
                            project=project, 
                            total_area = total_area,
                            endpoint=endpoint,
                            project_id=project_id)
    else:
        return redirect(url_for("projects.projects"))

@project_bp.route('/settings', methods=['GET', 'POST'])
#@project_bp.route('/settings/<project_id>', methods=['GET', 'POST'])
@login_required
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
            project.Specification = specification.name
        
        project.ProjectNumber = new_project_number
        project.ProjectName = new_project_name
        project.ProjectDescription = new_project_description
        

        db.session.commit()
        return redirect(url_for('project.project', project_id=project_id))

@project_bp.route('/reports', methods=['GET'])
@login_required
def reports(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    return render_template('reports.html',
                           user=current_user,
                           project=project,
                           endpoint=endpoint,
                           project_id=project_id)


@project_bp.route('/new_todo_item', methods=['POST'])
@login_required
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
@login_required
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