from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, session, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from .. import db_ops_energy as dbo
from ..globals import pattern_float, pattern_int, replace_and_convert_to_float, blueprint_setup
from markupsafe import escape

cooling_bp = Blueprint('cooling', __name__, static_folder='static', template_folder='templates')
blueprint_setup(cooling_bp)

@cooling_bp.route('/', defaults={'building': None}, methods=['GET', 'POST'])
@cooling_bp.route('/<building>', methods=['GET', 'POST'])
@jwt_required()
def cooling(project_id, building):
    project = dbo.get_project(project_id)
    project_buildings = dbo.get_all_project_buildings(project_id)
    endpoint = request.endpoint
    cooling = None
    if request.method == "GET":
        if building is None:
            return render_template('cooling.html',
                                user=current_user,
                                project_id = project_id,
                                project=project,
                                project_buildings=project_buildings,
                                endpoint=endpoint,
                                cooling=cooling,
                                building=building)
        else:
            building = dbo.get_building(building)
            rooms = building.rooms
            return render_template('cooling.html',
                                   user=current_user,
                                   project=project,
                                   building=building,
                                   project_buildings=project_buildings,
                                   rooms=rooms,
                                   project_id = project_id,
                                   endpoint=endpoint)
    elif request.method == "POST":
        requested_building_id = escape(request.form.get("project_building"))
        return redirect(url_for('cooling.cooling', building=requested_building_id, project_id=project_id))

@jwt_required()
@cooling_bp.route('/building_cooling_settings', methods=['POST'])
def building_cooling_settings(project_id):
    if request.is_json:
        data = request.get_json()
        building_id = escape(data["building_id"])
        processed_data = {}
        
        for key, value in data.items():
            if key == "building_id":
                processed_data[key] = value
            else:
                processed_data[key] = replace_and_convert_to_float(escape(value)) 
        rooms = dbo.get_all_rooms_energy_building(building_id)
        for room in rooms:
            dbo.set_standard_cooling_settings(room.id, processed_data)
            dbo.calculate_total_cooling_for_room(room.id)
        
        response = {"success": True, "redirect": url_for("cooling.cooling", building=building_id, project_id=project_id)}
    else:
        flash("Kunne ikke oppdatere bygningsdata kjøling", category="error")
        response = {"success": False, "redirect": url_for("cooling.cooling", building=building_id, project_id=project_id)} 
    return jsonify(response)

@jwt_required()
@cooling_bp.route('/update_cooling_table', methods=['POST'])
def update_cooling_table(project_id):
    if request.is_json:
        data = request.get_json()
        building_id = escape(data["building_id"])
        processed_data = {}
        for key, value in data.items():
            if key == "building_id":
                processed_data[key] = value
            else:
                processed_data[key] = replace_and_convert_to_float(escape(value))
        
        if dbo.update_room_data_cooling(processed_data["energy_data_id"], processed_data):
            response = {"success": True, "redirect": url_for("cooling.cooling", building=building_id, project_id=project_id)}
        else:
            flash("Kunne ikke oppdatere romdata kjøling", category="error")
            response = {"success": False, "redirect": url_for("cooling.cooling", building=building_id, project_id=project_id)} 
    return jsonify(response)
    
