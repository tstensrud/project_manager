from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request, session
from flask_login import login_required, current_user
from .. import models, db
from .. import db_operations as dbo
from markupsafe import escape

projects_bp = Blueprint('projects', __name__, static_folder='static', template_folder='templates')

@projects_bp.route('/', methods=['GET', 'POST'])
#@login_required
def projects():
    return jsonify({"message": "Projects route"})

@projects_bp.route('/new_project', methods=['GET', 'POST'])
@login_required
def new_project():
    endpoint = request.endpoint
    if request.method == "GET":
        return render_template("new_project.html",
                               user=current_user,
                               endpoint=endpoint)
    elif request.method == "POST":
        project_name = request.form.get('project_name').strip()
        project_number = request.form.get('project_number').strip()
        project_description = request.form.get('project_description').strip()
                
        if dbo.check_for_existing_project_number(project_number):
            flash("Prosjektnummer finnes allerede", category="error")
            return redirect(url_for("projects.projects"))
        
        new_project = models.Projects(ProjectNumber=project_number, 
                                      ProjectName=project_name, 
                                      ProjectDescription=project_description, 
                                      Specification=None)
        try:
            db.session.add(new_project)
            db.session.commit()
        except Exception as e:
            flash(f"Kunne ikke opprette prosjekt: {e}", category="error")
            return redirect(url_for("projects.projects"))
        
        session['project_name'] = project_name
        flash(f"Prosjekt \"{project_name}\" er opprettet", category="success")
        return redirect(url_for('projects.projects'))