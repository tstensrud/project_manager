from datetime import datetime, timezone, timedelta
import json
from flask import Blueprint, jsonify, request, url_for
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required, verify_jwt_in_request
from .. import db_operations as dbo
from .. import sanitary_calculations as sc
from .. import globals
from .. import excel
from functools import wraps

project_api_bp = Blueprint('project_api', __name__)
#globals.blueprint_setup(project_api_bp)

def admin_required(func):
    @wraps(func)
    @jwt_required()
    def wrapper(*args, **kwargs):
        verify_jwt_in_request()
        uuid = get_jwt_identity()
        user = dbo.get_user(uuid)
        if not user:
            return jsonify({"success": False, "message": "Fant ikke bruker"}),404
        if not user.admin:
            return jsonify({"success": False, "message": "Du har ikke tilgang på denne funksjonen"})
        return func(*args, **kwargs)
    return wrapper

@project_api_bp.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now(timezone.utc)
        target_timestamp = datetime.timestamp(now + timedelta(hours=24))
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
    if project:
        # Project data
        specification = dbo.get_specification(project.specification)
        total_area: float = dbo.summarize_project_area(project.uid)
        project_data = project.get_json()
        if specification:
            project_data["SpecificationName"] = specification.name
            project_data["SpecUid"] = specification.uid
        else:
            project_data["SpecificationName"] = None
        project_data["area"] = total_area

        # Building data
        buildings = dbo.get_all_project_buildings(project_uid=project_uid)
        total_rooms = dbo.count_rooms_in_project(project_uid=project_uid)
        buildings_summary = {}
        building_data = {}
        if buildings:
            for building in buildings:
                building_data[building.building_name] = dbo.get_building_data(building.uid, False, False, False)
            buildings_summary["building_data"] = building_data
            buildings_summary["rooms"] = total_rooms
            project_data["buildingData"] = buildings_summary

        # Ventilation systems
        systems = dbo.get_all_systems(project_uid=project_uid)
        if systems:
            system_data = {}
            for system in systems:
                system_data[system.system_name] = system.get_json()
            project_data["ventsystemData"] = system_data

        # Ventilation
        total_air_flow = dbo.summarize_project_airflow(project_uid=project_uid)
        project_data["airflow"] = total_air_flow

        # Energy
        total_heating = dbo.sum_heat_loss_project_chosen(project_uid)
        total_cooling_equipment = dbo.sum_cooling_from_equipment_project(project_uid)
        project_data["heating"] = total_heating
        project_data["cooling"] = total_cooling_equipment
        return jsonify({"success": True, "data": project_data})
    else:
        return jsonify({"error": "Fant ikke prosjekt"})

@project_api_bp.route('/project_specification/', methods=['GET'])
@jwt_required()
def get_project_specification(project_uid: str):
    project = dbo.get_project(project_uid)
    if project:
        specification = dbo.get_specification(project.specification)
        if specification:
            specification_data = specification.get_json()
            return jsonify({"success": True, "data": specification_data})
        return jsonify({"success": False, "message": "Ingen spesifikasjon satt"})
    return jsonify({"success": False, "message": "Fant ikke prosjekt"})
    
@project_api_bp.route('/settings/', methods=['GET'])
@jwt_required()
def settings(project_uid):
    project = dbo.get_project(project_uid)
    project_data = project.get_json()
    return jsonify({"data": project_data})

@project_api_bp.route('/settings/update_project/', methods=['PATCH'])
@jwt_required()
def set_spec(project_uid):
    data = request.get_json()
    project_number = None
    project_description = None
    project_name = None
    if data:
        if "project_number" in data:
            number_exist = dbo.check_for_existing_project_number(data["project_number"].strip())
            if number_exist:
                return jsonify({"success": False, "message": "Prosjektnummeret finnes allerede"})
            project_number = data["project_number"].strip()
        if "project_specification" in data:
            new_spec = dbo.set_project_specification(project_uid, data["project_specification"])
            if new_spec is False:
                return jsonify({"success": False, "message": "Kunne ikke oppdatere kravspesifikasjon"})
        project_name = data.get("project_name", None)
        project_description = data.get("description", None)
        update = dbo.update_project_information(project_uid, project_number=project_number, project_description=project_description,project_name=project_name)
        if update:
            return jsonify({"success": True, "message": "Prosjektdata oppdatert"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke oppdatere beskrivelse"})
    return jsonify({"success": False, "message": "Mottok ingen data"})

#
#
#   TODO ITEMS
#
#
@project_api_bp.route('/todo/', methods=['GET'])
@jwt_required()
def todo(project_uid):
    todo_list = dbo.get_project_todo_items(project_uid)
    return jsonify({"todo": todo_list})

@project_api_bp.route('/new_todo_item/<user_uuid>/', methods=['POST'])
@jwt_required()
def new_todo_item(project_uid, user_uuid):
    data = request.get_json()
    if data:
        content = data["todo_content"]
        if dbo.new_todo_item(project_uid, user_uuid, content):
            response = {"success": True, "message": "Huskepunkt opprettet"}
        else:
            response = {"success": False, "message": "Kunne ikke opprette huskepunkt"}
        return jsonify(response)
    return jsonify({"success": False, "message": "Ikke noe data mottatt"})

@project_api_bp.route('/todo_item_complete/', methods=['PATCH'])
@jwt_required()
def todo_item_complete(project_uid):
    data = request.get_json()
    item_uid = data["item_id"]
    uuid = data["completed_by"]
    if dbo.set_todo_item_completed(item_uid, uuid):
        response = {"success": True, "message": "Huskepunkt utført"}
    else:
        response = {"success": False, "message": "Kunne ikke merke huskepunkt utført"}
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
    total_rooms = dbo.count_rooms_in_project(project_uid)
    if buildings is None:
        return jsonify({"error": "Ingen bygg lagt til enda"})
    else:
        building_data = []
        for building in buildings:
            building_data.append(dbo.get_building_data(building.uid, True, True, False))
        return jsonify({"building_data": building_data, "rooms": total_rooms})

@project_api_bp.route('/buildings/get_building/<building_uid>/', methods=['GET'])
@jwt_required()
def get_building_data(project_uid: str, building_uid: str):
    building_data = dbo.get_building_data(building_uid, False, False, False)
    if building_data:
        return jsonify({"success": True, "data": building_data})
    return jsonify({"success": False, "message": "No building data found"})

@project_api_bp.route('/buildings/get_project_buildings/', methods=['GET'])
@jwt_required()
def get_project_buildings(project_uid: str):
    buildings = dbo.get_all_project_buildings(project_uid)
    if buildings:
        data = {}
        for building in buildings:
            data[building.building_name] = building.get_json()
        return jsonify({"success": True, "message":" Building data", "data": data})
    return jsonify({"success": False, "message": "Fant ingen bygg"})

@project_api_bp.route('/buildings/new_building/', methods=["POST"])
@jwt_required()
def new_building(project_uid):
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "message": "No data received"})
    else:
        name = data["buildingName"]
        duplicate_building_name = dbo.check_for_existing_building_name(project_uid, name)
        if duplicate_building_name:
            return jsonify({"success": False, "message": "Et bygg med dette navnet finnes allerede i prosjektet"})
        if dbo.new_building(project_uid, name):
            return jsonify({"success": True, "message": "Bygg opprettet"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke legge til nytt bygg"})

@project_api_bp.route('/buildings/edit/<building_uid>/', methods=['PATCH'])
@jwt_required()
def edit_building(project_uid, building_uid):
    data = request.get_json()
    if data:
        new_name = data["buildingName"].strip()
        exists = dbo.check_for_existing_building_name(project_uid, new_name)
        if exists:
            return jsonify({"success": False, "message": "Et bygg med dette navnet finnes allerede"})
        if dbo.edit_building_name(building_uid, new_name):
            return ({"success": True, "message": "Navn endret"})
        else:
            return ({"success": False, "message": "Kunne ikke endre bygningsnavn"})
    else:
        return ({"success": False, "message": "Mottok ikke data"})

@project_api_bp.route('/buildings/delete/<building_uid>/', methods=['DELETE'])
@jwt_required()
def delete_building(project_uid, building_uid):
    rooms = dbo.check_if_building_has_rooms(building_uid)
    if rooms:
        return jsonify({"success": False, "error": "Kan ikke slette bygg så lenge rom er tilknyttet bygget"})
    else:
        if dbo.delete_building(building_uid):
            return jsonify({"success": True, "message": "Bygg slettet"})
        else:
            return jsonify({"success": False, "error": "Kunne ikke slette bygg"})
#
#               
#   ROOMS
#
#
@project_api_bp.route('/rooms/', methods=['GET'])
@jwt_required()
def rooms(project_uid):
    project = dbo.get_project(project_uid)
    specification = project.specification

    if request.method == "GET":
        project_rooms = dbo.get_all_project_rooms(project_uid)
        if project_rooms:
            project_room_data = list(map(lambda room: room.get_json_room_data(), project_rooms))
            return jsonify({"success": True, "room_data": project_room_data, "spec": specification})
        else:
            return jsonify({"room_data": None, "spec": specification})

@project_api_bp.route('/rooms/new_room/<building_uid>/', methods=['POST'])
@jwt_required()
def new_room(project_uid: str, building_uid: str):
    project = dbo.get_project(project_uid)
    project_specification = project.specification
    data = request.get_json()
    if data:
        data_fields = ["roomType", "floor", "roomName", "roomNumber", "roomArea", "roomPeople"]
        for key, value in data.items():
            if key not in data_fields:
                return jsonify({"success": False, "message": "Feil i mottatt data"})
            
        building_uid = building_uid
        room_type_id = data["roomType"]
        floor = data["floor"].strip()
        name = data["roomName"].strip()
        room_number = data["roomNumber"].strip()
        
        if dbo.check_if_roomnumber_exists(building_uid, room_number):
            return jsonify({"success": False,"message": "Romnummer finnes allerede for dette bygget"})
        
        area = data["roomArea"].strip()
        converted_area = globals.replace_and_convert_to_float(area)
        if converted_area is False:
            return jsonify({"success": False,"message": "Areal må kun inneholde tall"})

        people = data["roomPeople"].strip()
        converted_people = globals.replace_and_convert_to_int(people)
        if converted_people is False:
            return jsonify({"success": False,"message": "Persontantall må kun inneholde tall"})
    
        vent_props = dbo.get_room_type(room_type_id, project_specification)
        new_room_id = dbo.new_room(project.uid, building_uid, room_type_id, floor, room_number, name, converted_area, converted_people, 
                                    vent_props.air_per_person, vent_props.air_emission,
                                    vent_props.air_process, vent_props.air_minimum,
                                    vent_props.ventilation_principle, vent_props.heat_exchange,
                                    vent_props.room_control, vent_props.notes, vent_props.db_technical,
                                    vent_props.db_neighbour, vent_props.db_corridor)
        dbo.initial_ventilation_calculations(new_room_id)

        return jsonify({"success": True, "message": f"Rom opprettet: {new_room_id}"})
    else:
        return jsonify({"success": False, "message": "Mottok ingen data"})

@project_api_bp.route('/rooms/building/<building_uid>/', methods=['GET'])
def get_rooms_in_building(project_uid: str, building_uid: str):
    rooms = dbo.get_all_rooms_building(building_uid)
    if rooms:
        room_data = {}
        for room in rooms:
            room_data[room.uid] = room.get_json_room_data()
        return jsonify({"success": True, "data": room_data})
    return jsonify({"success": False, "message": "No rooms found"})

@project_api_bp.route('/rooms/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def get_room(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    room_data = room.get_json_room_data()
    building = dbo.get_building(room.building_uid)
    room_data["BuildingName"] = building.building_name
    return jsonify({"room_data": room_data})

@project_api_bp.route('/rooms/update_room/<room_uid>/', methods=['PATCH'])
@jwt_required()
def udpate_room(project_uid, room_uid):
    data = request.get_json()
    if data:
        room = dbo.get_room(room_uid)
        processed_data = {}
        for key, value in data.items():
            key = globals.camelcase_to_snake(key)
            cleansed_value = value.strip()
            
            if key == "room_number":
                if dbo.check_if_roomnumber_exists(room.building_uid, cleansed_value):
                    return ({"success": False, "message": "Romnummer finnes allerede"})
                processed_data[key] = cleansed_value
            
            if key == "area":
                converted_float_value = globals.replace_and_convert_to_float(cleansed_value)
                if converted_float_value is False:
                    return jsonify({"success": False, "message": "Areal må kun inneholde tall"})
                processed_data[key] = converted_float_value
                
            elif key == "room_population":
                converted_int_value = globals.replace_and_convert_to_int(cleansed_value)
                if converted_int_value is False:
                    return jsonify({"success": False, "message": "Personer må kun inneholde tall"})
                processed_data[key] = converted_int_value
            
            else:
                processed_data[key] = cleansed_value

        if dbo.update_room_data(room_uid, processed_data):
            return jsonify({"success": True, "message": "Rom oppdtatert"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke oppdatere rom-data"})

@project_api_bp.route('/rooms/delete_room/<room_uid>/', methods=['DELETE'])
@jwt_required()
def delete_room(project_uid, room_uid):
    data = request.get_json()
    received_room_uid = data["roomId"]
    room = dbo.get_room(room_uid)
    room_system = room.system_uid
    if room_uid != received_room_uid:
        globals.log(f"Delete room attempted with mismatch between endpoint room_id and json-data-room id")
        return jsonify({"success": False, "message": "Feil i sletting av rom."})
    if dbo.delete_room(room_uid):
        dbo.update_system_airflows(room_system)
        response = {"success": True, "message": "Rom slettet"}
    else:
        response = {"success": False, "message": "Kunne ikke slette rom"}
    return jsonify(response)

@project_api_bp.route('/rooms/undo_delete/<room_uid>/', methods=['POST'])
@jwt_required()
def undo_delete(project_uid, room_uid):
    data = request.get_json()
    if data:
        if data["undo"] is True:
            if dbo.undo_delete_room(room_uid):
                return jsonify({"success": True, "message": "Sletting av rom angret"})
            else:
                return jsonify({"success": False, "message": "Kunne ikke angre på sletting"})
        else:
            return jsonify({"success": False, "message": "Feil i mottatt data"})
    else:
        return jsonify({"success": False, "message": "Fant ikke slettet rom"})
#
#               
#   VENTILATIONSYSTEMS
#
#

@project_api_bp.route('/systems/', methods=['GET'])
@jwt_required()
def ventsystems(project_uid):
    systems = dbo.get_all_systems(project_uid)
    if systems == []:
        return jsonify({"error": "Ingen systemer i databasen"})
    systems_data = list(map(lambda x: x.get_json(), systems))
    return jsonify({"systems_data": systems_data})

@project_api_bp.route('/get_system/<system_uid>/', methods=['GET'])
@jwt_required()
def get_system(project_uid, system_uid):
    system = dbo.get_system(system_uid)
    system_data = system.get_json()
    if system_data:
        return jsonify({"system_data": system_data})
    else:
        return jsonify({"success": False, "message": "Fant ikke system"})

@project_api_bp.route('/new_system/', methods=['POST'])
@jwt_required()
def new_system(project_uid):
    data = request.get_json()
    project = dbo.get_project(project_uid)
    system_number = data["systemNumber"].strip()

    if dbo.check_if_system_number_exists(project_uid, system_number):
        return jsonify({"success": False, "message": "Systemnummer finnes allerede"})
    try:
        airflow = float(data["airflow"].strip())
    except ValueError:
        return jsonify({"success": False, "message": "Luftmengde må kun inneholde tall"})
    
    service_area = data["serviceArea"].strip()
    placement = data["placement"].strip()
    if "special_system" in data:
        special_system = data["special_system"]
        if special_system is True or special_system == "True":
            special_system = "Ja"
        else:
            special_system = ""
    else:
        special_system = ""
    
    if "heat_exchange" not in data:
        return jsonify({"success": False, "message": "Du må velge type gjenvinner"})
    system_h_ex_in = data["heat_exchange"]
    if system_h_ex_in != "0":
        system_h_ex = system_h_ex_in.capitalize()
    else:
        system_h_ex = None

    new_system = dbo.new_ventilation_system(project.uid, system_number, placement, service_area, system_h_ex, airflow, special_system)
    if new_system:
        return jsonify({"success": True, "message": "System opprettet"})
    else:
        return jsonify({"success": False, "message": "Kunne ikke opprette nytt system"})

@project_api_bp.route('/update_system/<system_uid>/', methods=['PATCH'])
@jwt_required()
def update_system(project_uid, system_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        for key, value in data.items():
            key = globals.camelcase_to_snake(key)
            if key == "air_flow":
                converted_value = globals.replace_and_convert_to_float(value.strip())
                if converted_value is False:
                    return jsonify({"success": False, "message": "Viftekapasitet må kun inneholde tall"})
                processed_data[key] = converted_value
            else:
                processed_data[key] = value.strip()
        dbo.update_system_info(system_uid, processed_data)
        return jsonify({"success": True, "message": "System oppdatert"})
    return jsonify({"success": False, "message": "Mottok ingen data"})

@project_api_bp.route('/delete_system/<system_uid>/', methods=['DELETE'])
@jwt_required()
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

@project_api_bp.route('/ventilation/', methods=['GET'])
@jwt_required()
def ventilation(project_uid):
    total_air_flow = dbo.summarize_project_airflow(project_uid)
    return jsonify({"ventdata": total_air_flow})

@project_api_bp.route('/ventilation/building_data/<building_uid>/', methods=['GET'])
def get_building_vent_data(project_uid: str, building_uid: str):
    building_data = dbo.get_building_data(building_uid,True, False, False)
    if building_data:
        return jsonify({"success": True, "data": building_data})
    return jsonify({"success": False, "message":" No building data found"})

@project_api_bp.route('/ventilation/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def ventilation_get_room(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    if room:
        vent_data = room.get_json_ventilation_data()
        if vent_data["SystemId"] is not None:
            system_name = dbo.get_system(vent_data["SystemId"])
            vent_data["SystemName"] = system_name.system_name
        else:
            vent_data["SystemName"] = "Ikke satt"
        return jsonify({"vent_data": vent_data})
    else:
        return jsonify({"room_data": None})

@project_api_bp.route('/ventilation/update_room/<room_uid>/<cooling>/', methods=['PATCH'])
@jwt_required()
def ventilation_update_room(project_uid, room_uid, cooling):
    room = dbo.get_room(room_uid)
    data = request.get_json()
    current_room_system_uid = room.system_uid
    processed_data = {}

    for key, value in data.items():
        key = globals.camelcase_to_snake(key)

        if key == "air_supply" or key == "air_extract":
            
            converted_value = globals.replace_and_convert_to_float(str(value))
            if converted_value is False:
                return jsonify({"success": False, "message": "Tilluft og avtrekk må kun inneholde tall"})
            processed_data[key] = converted_value
        
        if key == "system_uid":
            processed_data[key] = value.strip()
            if current_room_system_uid is None:
                if dbo.update_room_data(room_uid, processed_data):
                    dbo.update_system_airflows(value)
                    return jsonify({"success": True, "message": "System satt"})
            else:
                if dbo.update_room_data(room_uid, processed_data):
                    if dbo.update_airflow_changed_system(value, current_room_system_uid):
                        return jsonify({"success": True, "message": "System endret"})
                    else:
                        return jsonify({"success": False, "message": "Kunne ikke bytte system"})   
    
    updated_room = dbo.update_room_data(room_uid, processed_data)
    if updated_room is False:
        return jsonify({"success": False, "message": "Kunne ikke oppdatere rom"})
    
    updated_vent_calc = dbo.update_ventilation_calculations(room_uid)
    if updated_vent_calc is False:
        return jsonify({"success": False, "message": "Kunne ikke oppdatere ventilasjonsberegninger"})

    if cooling == "1":
        dbo.calculate_total_cooling_for_room(room_uid)
    
    return jsonify({"success": True, "message": "Ventilasjonsdata oppdatert"})

#
#               
#   HEATING
#
#
@project_api_bp.route('/energy/', methods=['GET'])
@jwt_required()
def heating(project_uid):
    total_heating = dbo.sum_heat_loss_project_chosen(project_uid)
    total_cooling_equipment = dbo.sum_cooling_from_equipment_project(project_uid)
    return jsonify({"heating_data": total_heating, "cooling_data": total_cooling_equipment})

@project_api_bp.route('/heating/building_data/<building_uid>/', methods=['GET'])
def get_building_heating_data(project_uid, building_uid):
    building_data = dbo.get_building_data(building_uid, False, True, False)
    if building_data:
        return jsonify({"success": True, "data": building_data})
    return jsonify({"success": False, "message": "No building data found"})

@project_api_bp.route('/heating/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def heating_room_data(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    building = dbo.get_building(room.building_uid)
    building_data = building.get_json()
    if room:
        room_data = room.get_json_room_data()
        room_heating_data = room.get_json_heating_data()
        room_heating_data["Airflow"] = room.air_supply
        return jsonify({"room_data": room_data, "heating_data": room_heating_data, "building_data": building_data})
    else:
        return ({"error": "Fant ikke rom"})

@project_api_bp.route('/heating/update_room/<room_uid>/', methods=['PATCH'])
@jwt_required()
def heating_update_room(project_uid, room_uid):
    data = request.get_json()
    if data:
        float_values = ["room_height", "outer_wall_area", "inner_wall_area", "window_door_area",
                        "roof_area", "floor_ground_area", "floor_air_area", "chosen_heating"]
        processed_data = {}
        for key, value in data.items():
            key = globals.camelcase_to_snake(key)
            processed_value = value.strip()
            if key in float_values:
                float_value = globals.replace_and_convert_to_float(processed_value)
                if float_value is False:
                    return jsonify({"success": False, "message": f"Arealer, høyder og valgt varme må kun inneholde tall"})                    
                processed_data[key] = float_value
            else:
                processed_data[key] = processed_value
            
        if dbo.update_room_data(room_uid, processed_data):
            if dbo.calculate_total_heat_loss_for_room(room_uid):
                return jsonify({"success": True})
            else:
                return jsonify({"success": False, "message": "Kunne ikke beregne nye romdata"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke oppdatere romdata"})
 
@project_api_bp.route('/heating/buildingsettings/<building_uid>/', methods=['GET'])
@jwt_required()
def buildingsettings(project_uid, building_uid):
    building = dbo.get_building(building_uid)
    if building:
        building_data = building.get_json()
        return jsonify({"building_data": building_data})
    else:
        return jsonify({"error": "Fant ingen bygg"})
    

@project_api_bp.route('/heating/buildingsettings/update/<building_uid>/', methods=['PATCH'])
@jwt_required()
def update_buildingsettings(project_uid, building_uid):
    building = dbo.get_building(building_uid)
    data = request.get_json()
    if not building:
        return jsonify({"error": "Fant ingen bygg"})
    if data:
        processed_data = {}
        for key, value in data.items():
            converted_value = globals.replace_and_convert_to_float(value)
            if converted_value is False:
                return jsonify({"success": False, "message": "Innstillinger må kun inne holde tall"})
            processed_data[key] = converted_value
        if dbo.update_building_heating_settings(building_uid, processed_data):
            building_rooms = dbo.get_all_rooms_building(building_uid)
            for room in building_rooms:
                dbo.calculate_total_heat_loss_for_room(room.uid)
            return jsonify({"success": True, "message": "Oppdatert"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke oppdatere bygg"})
    else:
        return jsonify({"success": False, "message": "Fant ingen bygg"})
    
@project_api_bp.route('/heating/buildingsettings/setheatsource/<building_uid>/', methods=['PATCH'])
@jwt_required()
def set_heatsource(project_uid, building_uid):
    data = request.get_json()
    if data:
        rooms = dbo.get_all_rooms_building(building_uid)
        for room in rooms:
            update = dbo.update_room_data(room.uid, data)
            if update is False:
                return jsonify({"success": False, "message": "Kunne ikke sette varmekilde for rom"})
    return jsonify({"success": True, "message": "Rom oppdatert"})
#
#               
#   COOLING
#
#
@project_api_bp.route('/cooling/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def get_room_cooling(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    if room:
        room_data = room.get_json_room_data()
        room_cooling_data = room.get_json_cooling_data()
        room_cooling_data["Airflow"] = room.air_supply
        return jsonify({"success": True, "room_data": room_data, "cooling_data": room_cooling_data})
    else:
        return ({"success": False, "message": "Fant ikke rom"})

@project_api_bp.route('/cooling/building_data/<building_uid>/', methods=['GET'])
def get_building_cooling_data(project_uid, building_uid):
    building_data = dbo.get_building_data(building_uid, False, False, False)
    if building_data:
        return jsonify({"success": True, "data": building_data})
    return jsonify({"success": False, "message": "No building data found"})
    
@project_api_bp.route('/cooling/update_room/<room_uid>/', methods=['PATCH'])
@jwt_required()
def update_room_cooling(project_uid, room_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        for key, value in data.items():
            key = globals.camelcase_to_snake(key)
            value_checked = value.strip()
            converted_value = globals.replace_and_convert_to_float(value_checked)
            if converted_value is False:
                return jsonify({"success": False, "message": f"Celler for kjøledata må kun inneholde tall"})
            if key == "sun_reduction":
                if converted_value > 1:
                    return jsonify({"success": False, "message": "Solreduksjon kan være maks 1"})
            processed_data[key] = converted_value                

        if dbo.update_room_data(room_uid, processed_data):
            if dbo.calculate_total_cooling_for_room(room_uid):
                return jsonify({"success": True})
            else:
                return jsonify({"success": False, "message": "Kunne ikke beregne nye romdata"})
        else:
            return jsonify({"success": False, "message": "Kunne ikke oppdatere romdata"})

@project_api_bp.route('/cooling/update_all_rooms/<building_uid>/', methods=['PATCH'])
@jwt_required()
def update_all_rooms_cooling(project_uid, building_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        for key, value in data.items():
            key = globals.camelcase_to_snake(key)
            value_checked = value.strip()
            converted_value = globals.replace_and_convert_to_float(value_checked)
            if converted_value is False:
                return jsonify({"success": False, "message": "Kun tall er tillatt i celler."})
            if key == "sun_reduction":
                if converted_value > 1:
                    return jsonify({"success": False, "message": "Solreduksjon kan være maks 1"})
            processed_data[key] = converted_value
        rooms = dbo.get_all_rooms_building(building_uid)
        for room in rooms:
            if dbo.update_room_data(room.uid, processed_data):
                dbo.calculate_total_cooling_for_room(room.uid)
            else:
                return jsonify({"error": "Kunne ikke oppdatere romdata"})
    return jsonify({"success": True, "message": "Romdata oppdatert"})

#
#               
#   SANITARY
#
#
@project_api_bp.route('/sanitary/get_room/<room_uid>/', methods=['GET'])
@jwt_required()
def get_sanitary_room(project_uid, room_uid):
    room = dbo.get_room(room_uid)
    if room:
        room_data = room.get_json_room_data()
        room_sanitary_data = room.get_json_sanitary_data()
        return jsonify({"room_data": room_data, "sanitary_data": room_sanitary_data})
    else:
        return jsonify({"success": False, "message": "Fant ikke rom"})

@project_api_bp.route('/sanitary/buildings/', methods=['GET'])
@jwt_required()
def get_buildings_sanitary(project_uid):
    buildings = dbo.get_all_project_buildings(project_uid)
    if buildings is None:
        return jsonify({"success": False, "message": "Ingen bygg lagt til enda"})
    else:
        building_data = []

        for building in buildings:
            building_data.append(building.uid)
        return jsonify({"building_data": building_data})

@project_api_bp.route('/sanitary/get_building/<building_uid>/', methods=['GET'])
def get_sanitary_building_data(project_uid, building_uid):
    building_data = dbo.get_building_data(building_uid, False, False, True, include_sanitary_shafts=True)
    if building_data:
        return jsonify({"success": True, "data": building_data})
    return jsonify({"success": False, "message": "No building data found"})

@project_api_bp.route('/sanitary/update_room/<room_uid>/', methods=['PATCH'])
@jwt_required()
def update_room_sanitary(project_uid, room_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        for key, value in data.items():
            if key == "shaft":
                processed_data[key] = value
            else:
                value_checked = value.strip()
                converted_value = globals.replace_and_convert_to_float(value_checked)
                if converted_value is False:
                    return jsonify({"success": False, "message": f"Antall utsyr må kun inneholde tall"})
                processed_data[key] = converted_value
        if dbo.update_room_data(room_uid, processed_data):
            return jsonify({"success": True, "message": "Romdata oppdatert"})
        else:   
            return jsonify({"success": False, "message": "Kunne ikke oppdatere romdata"})
    else:
        return jsonify({"success": False, "message": "Fant ikke rom"})

@project_api_bp.route('/sanitary/building_summary/<building_uid>/', methods=['GET'])
@jwt_required()
def get_sanitary_building_summary(project_uid, building_uid):
    building = dbo.get_building(building_uid)
    if building:
        curve = building.graph_curve
        building_sanitary_totals = sc.sums_simul_waterflows_building(building_uid, curve)
        totals = {
            "drainage": {
                "pipe_size_vertical": sc.pipesize_drainage_vertical(building_sanitary_totals[0]),
                "pipe_siz_1_60": sc.pipesize_drainage_1_60(building_sanitary_totals[0]),
                "total":  building_sanitary_totals[0],
            },
            "cw": {
                "pipe_size": sc.pipesize_tap_water(building_sanitary_totals[1]),
                "total": building_sanitary_totals[1]
            },
            "ww": {
                "pipe_size": sc.pipesize_tap_water(building_sanitary_totals[2]),
                "total": building_sanitary_totals[2]
            }
        }
        building_data = dbo.get_building_data(building_uid, False, False, True)
        return jsonify({"success": True, "message": "Building data fetched", "building_data": building_data, "totals": totals})
    else:
        return jsonify({"success": False, "message": "No building found"})


@project_api_bp.route('/sanitary/update_curve/<building_uid>/', methods=["PATCH"])
@jwt_required()
def update_curve(project_uid, building_uid):
    data = request.get_json()
    if data:
        curve = data["curve"]
        updated_curve = dbo.update_building_graph_curve(building_uid, curve)
        if updated_curve:
            return jsonify({"success": True, "message": "Avløpskurve oppdatert"})
        return jsonify({"success": False, "message": "Kunne ikke oppdatere avløpskurve"})
    else:
        return jsonify({"success": False, "message": "Mottok ingen data"})


@project_api_bp.route('/excel/<sheet>/', methods=['GET'])
@jwt_required()
def ventilation_excel(project_uid, sheet):
    if sheet == "ventilation":
        file = excel.generate_excel_report(project_uid, vent=True)
    elif sheet == "heating":
        file = excel.generate_excel_report(project_uid, heating=True)
    elif sheet == "cooling":
        file = excel.generate_excel_report(project_uid, cooling=True)
    else:
        return jsonify({"success": False, "message": f"Kan ikke generere excel-fil for {sheet}"})
    
    if file:
        download_url = url_for(f'views.download_file', filename=file, _external=True)
        return jsonify({"success": True, "message": "Excel-fil generert", "data": download_url})
    else:
        return jsonify({"success": False, "message": "Kunne ikke generere excel-fil"})
    
