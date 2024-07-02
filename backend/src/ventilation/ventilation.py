from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request, session
from flask_login import current_user
from .. import db_ops_energy as dbo
from flask_jwt_extended import jwt_required
from ..globals import get_project, pattern_float, blueprint_setup
from markupsafe import escape

ventilation_bp = Blueprint('ventilation', __name__, static_folder='static', template_folder='templates')
blueprint_setup(ventilation_bp)

@ventilation_bp.route('/', defaults={'building_id': None, 'room_id': None}, methods=['GET', 'POST'])
@ventilation_bp.route('/<building_id>', defaults={'room_id': None}, methods=['GET', 'POST'])
@ventilation_bp.route('/<building_id>/<room_id>', methods=['GET'])
@jwt_required()
def ventilation(building_id, room_id, project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    if request.method == "POST":
        # Showing specific buildings in the table
        requested_building_id = escape(request.form.get("project_building"))
        if requested_building_id != "none" and requested_building_id != "showall":
            return redirect(url_for("ventilation.ventilation", building_id = requested_building_id, project_id=project_id))
        else:
            return redirect(url_for("ventilation.ventilation", building_id = "showall", project_id=project_id))
    
    elif request.method == "GET":
        summaries = []
        summaries.append(dbo.summarize_demand_building(project_id, building_id))
        summaries.append(dbo.summarize_supply_air_building(project_id, building_id))
        summaries.append(dbo.summarize_extract_air_building(project_id, building_id))
        
        if room_id:
            room_data = dbo.get_room(room_id)
            ventilation_data = room_data.ventilation_properties
            system = dbo.get_system(ventilation_data.SystemId)
            return render_template("room_data.html",
                                user=current_user,
                                project=project,
                                ventilation_data = ventilation_data,
                                room_data=room_data,
                                system=system,
                                endpoint=endpoint,
                                project_id=project_id)
        # Show all rooms for building
        if building_id is not None and building_id != "showall":
            ventilation_data = dbo.get_ventilation_data_rooms_in_building(project.id, building_id)
        # Show all rooms for project
        else:
            ventilation_data = dbo.get_ventlation_data_all_rooms_project(project.id)
        project_buildings = dbo.get_all_project_buildings(project.id)
        systems = dbo.get_all_systems(project.id)
        building = dbo.get_building(building_id)
        return render_template("ventilation.html",
                               user=current_user,
                               project=project,
                               ventilation_data = ventilation_data,
                               summaries = summaries,
                               building=building,
                               project_buildings = project_buildings,
                               system_names = systems,
                               endpoint=endpoint,
                               project_id=project_id)

@ventilation_bp.route('/update_ventilation', methods=['POST'])
@jwt_required()
def update_ventilation(project_id):
    data = request.get_json()
    system_id = escape(data["system_id"])
    building_id = escape(data["building_id"])
    project_id = escape(data["project_id"])
    
    # If system is updated
    if data["system_update"] == True:
        old_system_id = escape(data["old_system_id"])
        vent_prop_id = escape(data["row_id"])
        if old_system_id == "none":
            if dbo.set_system_for_room(vent_prop_id, system_id):
                dbo.update_system_airflows(system_id)
                flash("System satt", category="success")
                response = {"success": True, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
            else:
                flash("System kunne ikke settes", category="error")
                response = {"success": False, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
            return jsonify(response)

        if old_system_id == system_id:
            if dbo.update_system_airflows(system_id):
                flash("System oppdatert", category="success")
                response = {"success": True, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
            else:
                flash("Kunne ikke oppdatere luftmengde dbo.update_system_airflows", category="error")
                response = {"success": False, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
                return jsonify(response)
        else:
            dbo.set_system_for_room(vent_prop_id, system_id)
            if dbo.update_airflow_changed_system(system_id, old_system_id):
                flash("System oppdatert", category="success")
                response = {"success": True, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
            else:
                flash("Kunne ikke oppdatere luftmengder: update_airflow_changed_system", category="error")
                response = {"success": False, "redirect": url_for("ventilation.ventilation", project_id=project_id)}
                return jsonify(response)

    else:       
        vent_prop_id = escape(data["vent_data_id"])
        supply = escape(data["supply_air"].strip())
        
        new_supply = pattern_float(supply)
        if new_supply is False:
            flash("Tilluft kan kun inneholde tall.", category="error")
            response = {"success": False, "redirect": url_for("ventilation.ventilation", building_id = building_id, project_id=project_id)}
            return jsonify(response)
        
        extract = escape(data["extract_air"].strip())
        new_extract = pattern_float(extract)
        if new_extract is False:
            flash("Avtrekk kan kun inneholde tall.", category="error")
            response = {"success": False, "redirect": url_for("ventilation.ventilation", building_id = building_id, project_id=project_id)}
            return jsonify(response)
        
        comment = escape(data["comment"].strip())
        

        if dbo.update_ventilation_table(vent_prop_id, new_supply, new_extract, system_id):
            if dbo.update_system_airflows(system_id):
                dbo.calculate_total_heat_loss_for_room(dbo.get_room_vent_prop(vent_prop_id).room_ventilation.energy_properties.id)
                dbo.calculate_total_cooling_for_room(dbo.get_room_vent_prop(vent_prop_id).room_ventilation.energy_properties.id)

                response = {"success": True, "redirect": url_for("ventilation.ventilation", building_id = building_id, project_id=project_id)}
        else:
            flash("Kunne ikke oppdatere verdier.", category="error")
            response = {"success": False, "redirect": url_for("ventilation.ventilation", building_id = building_id, project_id=project_id)}
            return jsonify(response)
        
    return jsonify(response)
