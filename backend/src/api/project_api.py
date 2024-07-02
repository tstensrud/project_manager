from datetime import datetime, timezone, timedelta
import os
import json
from flask import Blueprint, render_template, jsonify, flash, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
from .. import db_operations as dbo
from .. import globals
from markupsafe import escape

project_api_bp = Blueprint('project_api', __name__, static_folder='static', template_folder='templates')
globals.blueprint_setup(project_api_bp)

@project_api_bp.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(minutes=30))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            data = response.get_json()
            if type(data) is dict:
                data["access_token"] = access_token
                response.data = json.dumps(data)
        return response
    except (RuntimeError, KeyError):
        return response

#
# 
#   PROJECT 
# 
#    


@project_api_bp.route('/', methods=['GET'])
@jwt_required()
def project(project_uid):
    project = dbo.get_project(project_uid)
    specification = dbo.get_specification(project.specification)
    if project is not None:
        total_area: float = dbo.summarize_project_area(project.id)
        project_data = project.get_json()
        if specification is not None:
            project_data["SpecificationName"] = specification.name
        else:
            project_data["SpecificationName"] = None
        return jsonify({"data": project_data})
    else:
        return jsonify({"data": "Fant ikke prosjekt"})

@project_api_bp.route('/settings/', methods=['GET'])
@jwt_required()
def settings(project_uid):
    project = dbo.get_project(project_uid)
    project_data = project.get_json()
    return jsonify({"data": project_data})


@project_api_bp.route('/reports', methods=['GET'])
@jwt_required()
def reports(project_id):
    pass


@project_api_bp.route('/settings/update_project/', methods=['POST'])
@jwt_required()
def set_spec(project_uid):
    data = request.get_json()
    #print(f"Specdata: {data}")
    if dbo.set_project_specification(project_uid, data):
        return jsonify({"message": "Success"})
    else:
        return jsonify({"message": "Failed to set specification"})

#
#
#   TODO ITEMS
#
#


@project_api_bp.route('/new_todo_item', methods=['POST'])
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


@project_api_bp.route('/todo_item_complete', methods=['POST'])
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


#
#
#   BUILDINGS
#
#

@project_api_bp.route('/buildings/', methods=['GET'])
@jwt_required()
def buildings(project_uid):
    buildings = dbo.get_all_project_buildings(project_uid)
    if buildings is None:
        return jsonify({"building_data": None})
    else:
        building_data = {}
        for building in buildings:
            building_data[building.uid] = dbo.get_building_data(building.uid)
        return jsonify({"building_data": building_data})

@project_api_bp.route('/buildings/get_project_buildings/', methods=["GET"])
@jwt_required()
def get_project_buildings(project_uid):
    buildings = dbo.get_all_project_buildings(project_uid)

    if buildings is None:
        return jsonify({"building_data": None})
    else:
        building_data = {}
        for building in buildings:
            building_data[building.uid] = building.building_name
        return jsonify({"building_data": building_data})


@project_api_bp.route('/buildings/new_building/', methods=["POST"])
@jwt_required()
def new_building(project_uid):
    data = request.get_json()
    name = escape(data["buildingName"])
    if not data:
        return jsonify({"building_data": "No data received"})
    else:
        if dbo.new_building(project_uid, name):
            return jsonify({"building_data": "Success"})
        else:
            return jsonify({"building_data": "Could not add new building"})


#
#               
#   ROOMS
#
#

@project_api_bp.route('/rooms/', methods=['GET', 'POST'])
@jwt_required()
def rooms(project_uid):
    project = dbo.get_project(project_uid)
    specification = project.specification

    if request.method == "GET":
        #print("A get request was reveiced")
        project_rooms = dbo.get_all_project_rooms(project.uid)
        if project_rooms:
            project_room_data = list(map(lambda x: x.get_json_room_data(), project_rooms))
            return jsonify({"room_data": project_room_data, "spec": specification})
        else:
            return jsonify({"room_data": None, "spec": specification})

    if request.method == "POST":
        #print("A post request was reveiced")
        project_specification = project.specification
        data = request.get_json()
        #print(f"JSON data received: {data}")
        building_id = escape(data["buildingId"])
        room_type_id = escape(data["roomType"])
        floor = escape(data["floor"].strip())
        name = escape(data["roomName"].strip())
        room_number = escape(data["roomNumber"].strip())
        
        if dbo.check_if_roomnumber_exists(project.id, building_id, room_number):
            return jsonify({"error": "Romnummer finnes allerede for dette bygget"})
        
        area = escape(data["roomArea"].strip())
        try:
            area = float(area)
        except ValueError:
            return jsonify({"error": "Areal må kun inneholde tall"})
            
        people = escape(data["roomPeople"].strip())
        try:
            people = int(people)
        except ValueError:
            return jsonify({"error": "Persontantall må kun inneholde tall"})
    
        vent_props = dbo.get_room_type_data(room_type_id, project_specification)
        globals.log(f"VENT PROPS: {vent_props}")
        new_room_id = dbo.new_room(building_id, room_type_id, floor, room_number, name, area, people, 
                                    vent_props.air_per_person, vent_props.air_emission,
                                    vent_props.air_process, vent_props.air_minimum,
                                    vent_props.ventilation_principle, vent_props.heat_exchange,
                                    vent_props.room_control, vent_props.notes, vent_props.db_technical,
                                    vent_props.db_neighbour, vent_props.db_corridor)
        globals.log(f"new room id: {new_room_id}")
        dbo.initial_ventilation_calculations(new_room_id)
        

        return jsonify({"message": "Rom opprettet"})

@project_api_bp.route('/rooms/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def get_room(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    room_data = room.get_json_room_data()
    #print(f"ROOM DATA IS: {room_data}")
    return jsonify({"room_data": room_data})


@project_api_bp.route('/rooms/update_room/<room_uid>/', methods=['POST'])
@jwt_required()
def udpate_room(project_uid, room_uid):
    data = request.get_json()
    room = dbo.get_room(room_uid)
    processed_data = {}
    for key, value in data.items():
        key = globals.camelcase_to_snake(key)
        processed_data[key] = escape(value.strip())
        if key == "area":
            try:
                converted_value = float(value)
            except ValueError as e:
                return jsonify({"error": "Area må kun inneholde tall"})
        elif key == "room_population":
            try:
                converted_value = int(value)
            except ValueError as e:
                return jsonify({"error": "Personer må kun inneholde tall"})
        if dbo.update_room_data(room_uid, processed_data):
            dbo.update_ventilation_calculations(room_uid)
        else:
            return jsonify({"error": "Kunne ikke oppdatere rom-data"})
    
    return jsonify({"message": f"Received data {room_uid}"})

@project_api_bp.route('/rooms/delete_room/<room_uid>/', methods=['POST'])
@jwt_required()
def delete_room(project_uid, room_uid):
    if request.method == "POST":
        data = request.get_json()
        received_room_uid = escape(data["roomId"])
        if room_uid != received_room_uid:
            globals.log(f"Delete room attempted with mismatch between endpoint room_id and json-data-room id")
            return jsonify({"message": "Feil i sletting av rom."})
        if dbo.delete_room(room_uid):
            response = {"message": "Rom slettet"}
        else:
            response = {"message": "Kunne ikke slette rom"}
    return jsonify({"message": "Rom slettet"})

#
#               
#   SYSTEMS
#
#

@jwt_required()
@project_api_bp.route('/systems/', methods=['GET'])
def ventsystems(project_uid):
    project = dbo.get_project(project_uid)
    data = request.get_json()
    systems = dbo.get_all_systems(project.uid)
    if systems == []:
        return jsonify({"system_data": None})
    
    return jsonify({"system_data": systems})

@jwt_required()
@project_api_bp.route('/new_system/', methods=['POST'])
def new_system(project_uid):
    project = dbo.get_project(project_uid)
    system_number = escape(request.form.get("system_number").strip())
    if dbo.check_if_system_number_exists(project.id, system_number):
        return jsonify({"error", "Systemnummer finnes allerede"})
    
    try:
        airflow = float(escape(request.form.get("airflow").strip()))
    except ValueError:
        return jsonify({"error": "Luftmengde må kun inneholde tall"})
    
    service_area = escape(request.form.get("system_service").strip())
    placement = escape(request.form.get("system_placement").strip())
    system_type = escape(request.form.get("special_system"))
    if system_type != "None":
        system_type = "Ja"
    else:
        system_type = ""
    
    
    system_h_ex_in = escape(request.form.get("heat_exchange").strip())
    if system_h_ex_in == "none":
        return jsonify({"error", "Du velge type gjenvinner"})
    if system_h_ex_in != "0":
        system_h_ex = system_h_ex_in.capitalize()
    else: system_h_ex = None

    new_system = dbo.new_ventilation_system(project.uid, system_number, placement, service_area, system_h_ex, airflow, system_type)
    if new_system:
        return jsonify({"success": True})
    else:
        return jsonify({"error", "Kunne ikke opprette nytt system"})
    


@jwt_required()
@project_api_bp.route('/update_system/<system_uid>/', methods=['POST'])
def update_system(project_id):
    data = request.get_json()
    project_id = escape(data["project_id"])
    system_id = escape(data["system_id"])
    system_number = escape(data["system_number"].strip())
    system_location = escape(data["system_location"].strip())
    service_area = escape(data["service_area"].strip())
    airflow = escape(data["airflow"].strip())
    airflow_float = globals.pattern_float(airflow)
    heat_ex = escape(data["system_hx"].strip())
    
    if dbo.update_system_info(system_id, system_number, system_location, service_area, airflow_float, heat_ex):
        flash("System-data oppdatert", category="success")
        response = {"success": True, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
    else:
        flash("Kunne ikke oppdatere system-data", category="error")
        response = {"success": False, "redirect": url_for("ventsystems.ventsystems", project_id=project_id)}
    
    return jsonify(response)

@jwt_required()
@project_api_bp.route('/delete_system/<system_uid/', methods=['POST'])
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