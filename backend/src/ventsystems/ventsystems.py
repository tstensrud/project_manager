
from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from ..globals import pattern_int, pattern_float, blueprint_setup
from markupsafe import escape

ventsystems_bp = Blueprint('ventsystems', __name__, static_folder='static', template_folder='templates')
blueprint_setup(ventsystems_bp)

@jwt_required()
@ventsystems_bp.route('/', methods=['GET', 'POST'])
def ventsystems(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    
    if request.method == "POST":
        system_number = escape(request.form.get("system_number").strip())
        if dbo.check_if_system_number_exists(project.id, system_number):
            flash("Systemnummer finnes allerede", category="error")
            return redirect(url_for('ventsystems.ventsystems'))
        
        try:
            airflow = float(escape(request.form.get("airflow").strip()))
        except ValueError:
            flash("Luftmengde kan kun inneholde tall", category="error")
            return redirect(url_for('ventsystems.ventsystems', project_id=project_id))
        
        service_area = escape(request.form.get("system_service").strip())
        placement = escape(request.form.get("system_placement").strip())
        system_type = escape(request.form.get("special_system"))
        if system_type != "None":
            system_type = "Ja"
        else:
            system_type = ""
        
        
        system_h_ex_in = escape(request.form.get("heat_exchange").strip())
        if system_h_ex_in == "none":
            flash("Du må velge en type gjenvinner for aggregatet", category="error")
            return redirect(url_for('ventsystems.ventsystems', project_id=project_id))
        if system_h_ex_in != "0":
            system_h_ex = system_h_ex_in.capitalize()
        else: system_h_ex = None

        if dbo.new_ventilation_system(project.id, system_number, placement, service_area, system_h_ex, airflow, system_type):
            flash("System opprettet", category="success")
            return redirect(url_for('ventsystems.ventsystems', project_id=project_id))
        else:
            flash("Kunne ikke opprette system.", category="error")
            return redirect(url_for('ventsystems.ventsystems', project_id=project_id))
    
    if request.method == "GET":
        systems = dbo.get_all_systems(project.id)
        return render_template("vent_systems.html", 
                                user=current_user, 
                                project=project,
                                systems=systems,
                                endpoint=endpoint,
                                project_id=project_id)


@jwt_required()
@ventsystems_bp.route('/update_system', methods=['POST'])
def update_system(project_id):
    data = request.get_json()
    project_id = escape(data["project_id"])
    system_id = escape(data["system_id"])
    system_number = escape(data["system_number"].strip())
    system_location = escape(data["system_location"].strip())
    service_area = escape(data["service_area"].strip())
    airflow = escape(data["airflow"].strip())
    airflow_float = pattern_float(airflow)
    heat_ex = escape(data["system_hx"].strip())
    
    if dbo.update_system_info(system_id, system_number, system_location, service_area, airflow_float, heat_ex):
        flash("System-data oppdatert", category="success")
        response = {"success": True, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
    else:
        flash("Kunne ikke oppdatere system-data", category="error")
        response = {"success": False, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
    
    return jsonify(response)

@jwt_required()
@ventsystems_bp.route('/delete_system', methods=['POST'])
def delete_system(project_id):
    if request.method == "POST":
        data = request.get_json()
        system_id = escape(data["system_id"])
        if dbo.delete_system(system_id):
            flash("System slettet", category="success")
            response = {"success": True, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
        else:
            flash("Kunne ikke slette system", category="error")
            response = {"success": False, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
        return jsonify(response)