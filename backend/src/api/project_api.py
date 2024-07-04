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

@jwt_required()
@project_api_bp.route('/', methods=['GET'])
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

@jwt_required()
@project_api_bp.route('/settings/', methods=['GET'])
def settings(project_uid):
    project = dbo.get_project(project_uid)
    project_data = project.get_json()
    return jsonify({"data": project_data})

@jwt_required()
@project_api_bp.route('/reports', methods=['GET'])
def reports(project_id):
    pass

@jwt_required()
@project_api_bp.route('/settings/update_project/', methods=['POST'])
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

@jwt_required()
@project_api_bp.route('/new_todo_item', methods=['POST'])
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

@jwt_required()
@project_api_bp.route('/todo_item_complete', methods=['POST'])
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
@jwt_required()
@project_api_bp.route('/buildings/', methods=['GET'])
def buildings(project_uid):
    buildings = dbo.get_all_project_buildings(project_uid)
    if buildings is None:
        return jsonify({"building_data": None})
    else:
        #building_data = {}
        building_data = []
        for building in buildings:
            building_data.append(dbo.get_building_data(building.uid))
        return jsonify({"building_data": building_data})

@jwt_required()
@project_api_bp.route('/buildings/new_building/', methods=["POST"])
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
@jwt_required()
@project_api_bp.route('/rooms/', methods=['GET', 'POST'])
def rooms(project_uid):
    project = dbo.get_project(project_uid)
    specification = project.specification

    if request.method == "GET":
        project_rooms = dbo.get_all_project_rooms(project.uid)
        if project_rooms:
            project_room_data = list(map(lambda x: x.get_json_room_data(), project_rooms))
            return jsonify({"room_data": project_room_data, "spec": specification})
        else:
            return jsonify({"room_data": None, "spec": specification})

    if request.method == "POST":
        project_specification = project.specification
        data = request.get_json()
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
        new_room_id = dbo.new_room(building_id, room_type_id, floor, room_number, name, area, people, 
                                    vent_props.air_per_person, vent_props.air_emission,
                                    vent_props.air_process, vent_props.air_minimum,
                                    vent_props.ventilation_principle, vent_props.heat_exchange,
                                    vent_props.room_control, vent_props.notes, vent_props.db_technical,
                                    vent_props.db_neighbour, vent_props.db_corridor)
        dbo.initial_ventilation_calculations(new_room_id)

        return jsonify({"message": f"Rom opprettet: {new_room_id}"}) 

@jwt_required()
@project_api_bp.route('/rooms/get_room/<room_uid>/', methods=['GET'])
def get_room(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    room_data = room.get_json_room_data()
    return jsonify({"room_data": room_data})

@jwt_required()
@project_api_bp.route('/rooms/update_room/<room_uid>/', methods=['PATCH'])
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
                return jsonify({"error": "Areal må kun inneholde tall"})
        elif key == "room_population":
            try:
                converted_value = int(value)
            except ValueError as e:
                return jsonify({"error": "Personer må kun inneholde tall"})
        elif key == "system_uid":
            print(f"Trying to update system ID:{value}")
            dbo.update_system_airflows(value)
    if dbo.update_room_data(room_uid, processed_data):
        dbo.update_ventilation_calculations(room_uid)
    else:
        return jsonify({"error": "Kunne ikke oppdatere rom-data"})
    
    return jsonify({"message": f"Received data {room_uid}"})

@jwt_required()
@project_api_bp.route('/rooms/delete_room/<room_uid>/', methods=['DELETE'])
def delete_room(project_uid, room_uid):
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
#   VENTILATIONSYSTEMS
#
#

@jwt_required()
@project_api_bp.route('/systems/', methods=['GET'])
def ventsystems(project_uid):
    systems = dbo.get_all_systems(project_uid)
    if systems == []:
        return jsonify({"error": "Ingen systemer i databasen"})
    systems_data = list(map(lambda x: x.get_json(), systems))
    return jsonify({"systems_data": systems_data})

@jwt_required()
@project_api_bp.route('/get_system/<system_uid>/', methods=['GET'])
def get_system(project_uid, system_uid):
    system = dbo.get_system(system_uid)
    system_data = system.get_json()
    if system_data:
        return jsonify({"system_data": system_data})
    else:
        return jsonify({"error": "Fant ikke system"})

@jwt_required()
@project_api_bp.route('/new_system/', methods=['POST'])
def new_system(project_uid):
    data = request.get_json()
    print(f"New system data received: {data}")
    project = dbo.get_project(project_uid)
    system_number = escape(data["systemNumber"].strip())

    if dbo.check_if_system_number_exists(project_uid, system_number):
        return jsonify({"error": "Systemnummer finnes allerede"})
    try:
        airflow = float(escape(data["airflow"].strip()))
    except ValueError:
        return jsonify({"error": "Luftmengde må kun inneholde tall"})
    
    service_area = escape(data["serviceArea"].strip())
    placement = escape(data["placement"].strip())
    if "special_system" in data:
        special_system = escape(data["special_system"])
        if special_system is True or special_system == "True":
            special_system = "Ja"
        else:
            special_system = ""
    else:
        special_system = ""
    
    system_h_ex_in = escape(data["heat_exchange"].strip())
    if system_h_ex_in == "none":
        return jsonify({"error", "Du velge type gjenvinner"})
    if system_h_ex_in != "0":
        system_h_ex = system_h_ex_in.capitalize()
    else: system_h_ex = None

    new_system = dbo.new_ventilation_system(project.uid, system_number, placement, service_area, system_h_ex, airflow, special_system)
    if new_system:
        return jsonify({"success": True})
    else:
        return jsonify({"error", "Kunne ikke opprette nytt system"})
    


@jwt_required()
@project_api_bp.route('/update_system/<system_uid>/', methods=['PATCH'])
def update_system(project_uid, system_uid):
    data = request.get_json()
    processed_data = {}
    for key, value in data.items():
        key = globals.camelcase_to_snake(key)
        if key == "air_flow":
            try:
                convert = float(value)
            except ValueError:
                return jsonify({"error": "Viftekapasitet må kun inneholde tall"})
        processed_data[key] = escape(value.strip())
    dbo.update_system_info(system_uid, processed_data)
    
    return jsonify({"success": True})

@jwt_required()
@project_api_bp.route('/delete_system/<system_uid>/', methods=['DELETE'])
def delete_system(project_uid, system_uid):
    data = request.get_json()
    if dbo.delete_system(system_uid):
        response = {"success": True}
    else:
        response = {"success": False}
    return jsonify(response)
#
#               
#   VENTILATION
#
#
@jwt_required()
@project_api_bp.route('/ventilation/get_room/<room_uid>/', methods=['GET'])
def ventilation(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    if room:
        vent_data = room.get_json_ventilation_data()
        return jsonify({"vent_data": vent_data})
    else:
        return jsonify({"room_data": None})