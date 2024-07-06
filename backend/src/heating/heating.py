from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from ..globals import pattern_float, replace_and_convert_to_float, blueprint_setup
from markupsafe import escape

heating_bp = Blueprint('heating', __name__, static_folder="static", template_folder="templates")
blueprint_setup(heating_bp)


@heating_bp.route('/', defaults={'building': None}, methods=['GET', 'POST'])
@heating_bp.route('/<building>', methods=['GET', 'POST'])
@jwt_required()
def heating(building, project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
    buildings = dbo.get_all_project_buildings(project.id)
    if request.method == "GET":
        if building is None:
            heat_loss_project = []
            heat_loss_project.append(dbo.sum_heat_loss_project(project.id))
            heat_loss_project.append(dbo.sum_heat_loss_project_chosen(project.id))
            return render_template('heating.html',
                                user=current_user,
                                project=project,
                                heating=None,
                                project_buildings=buildings,
                                building=None,
                                summary=heat_loss_project,
                                endpoint=endpoint,
                                project_id=project_id)
        else:
            building = dbo.get_building(building)
            heatloss_sum = []
            heatloss_sum.append(dbo.sum_heat_loss_building(building.id))
            heatloss_sum.append(dbo.sum_heat_loss_chosen_building(building.id))
            heatprops = dbo.get_building_energy_settings(building.id)
            rooms = building.rooms
            return render_template('heating.html',
                    user=current_user,
                    project=project,
                    heating=heatprops,
                    project_buildings=buildings,
                    building=building,
                    rooms = rooms,
                    heatloss=heatloss_sum,
                    endpoint=endpoint,
                    project_id=project_id)
        
    if request.method == "POST":
        requested_building_id = escape(request.form.get("project_building"))
        return redirect(url_for("heating.heating", building=requested_building_id, project_id=project_id))
    
@heating_bp.route('/building_heating_settings', methods=['POST'])
@jwt_required()
def building_heating_settings(project_id):
    if request.is_json:
        data = request.get_json()
        building_id = escape(data["building_id"])
        processed_data = {}

        # Replace ,-s to .-s and convert values to float
        for key, value in data.items():
            if key == "building_id":
                processed_data[key] = value
            else:
                processed_data[key] = replace_and_convert_to_float(escape(value))
        
        if dbo.update_building_heating_settings(processed_data):
            rooms_in_building = dbo.get_all_rooms_building(building_id)
            for room in rooms_in_building:
                dbo.calculate_total_heat_loss_for_room(room.id)
            flash(f"Oppdatert innstillinger for bygg {building_id}", category="success")
            response = {"success": True, "redirect": url_for("heating.heating", building=building_id, project_id=project_id)}
        else:
            flash("Kunne ikke oppdatere bygningsdata", category="error")
            response = {"success": False, "redirect": url_for("heating.heating", building=building_id, project_id=project_id)}
            return jsonify(response)
    return jsonify(response)

@heating_bp.route('/update_room_info', methods=['GET', 'POST'])
@jwt_required()
def update_room_info(project_id):
    if request.is_json:
        data = request.get_json()
        project_id = escape(data["project_id"])
        building_id = escape(data["building_id"])
        processed_data = {}
        for key, value in data.items():
            if key == "heat_source" or key == "comment":
                processed_data[key] = escape(value)
            else:
                value_cleaned_up = escape(value.replace(",", "."))
                processed_data[key] = pattern_float(value_cleaned_up)
        if dbo.update_room_heating_data(escape(data["vent_data_id"]), processed_data):
            if dbo.calculate_total_heat_loss_for_room(data["vent_data_id"]):
                flash("Data oppdatert", category="success")
                response = {"success": True, "redirect": url_for("heating.heating", building=building_id, project_id=project_id)}
            else:
                flash("Kunne ikke beregne varmetap", category="error")
                response = {"success": False, "redirect": url_for("heating.heating", building=building_id, project_id=project_id)}
                return jsonify(response)
        else:
            flash("kunne ikke oppdatere varmedaga", category="error")
            response = {"success": False, "redirect": url_for("heating.heating", building=building_id, project_id=project_id)}
    return jsonify(response)
