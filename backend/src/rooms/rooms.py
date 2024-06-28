from flask import Blueprint, url_for, flash, jsonify, session, request
from flask_login import login_required
from .. import db_operations as dbo
from ..globals import pattern_float, pattern_int, blueprint_setup, log
from markupsafe import escape
from flask_jwt_extended import jwt_required

rooms_bp = Blueprint('rooms', __name__, static_folder='static', template_folder='templates')
blueprint_setup(rooms_bp)

@rooms_bp.route('/<project_id>/', methods=['GET', 'POST'])
@jwt_required()
def rooms(project_id):
    project = dbo.get_project(project_id)

    if request.method == "GET":
        project_rooms = dbo.get_all_project_rooms(project.id)
        if project_rooms:
            project_room_data = list(map(lambda x: x.get_json(), project_rooms))
            return jsonify({"room_data": project_room_data})
        else:
            return jsonify({"room_data": None})

    if request.method == "POST":
        project_specification = project.specification
        data = request.get_json()
        print(f"JSON data received: {data}")
        building_id = int(escape(data["buildingId"]))
        room_type_id = int(escape(data["roomType"]))
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
        log(f"VENT PROPS: {vent_props}")
        new_room_id = dbo.new_room(building_id, room_type_id, floor, room_number, name, area, people, 
                                    vent_props.air_per_person, vent_props.air_emission,
                                    vent_props.air_process, vent_props.air_minimum,
                                    vent_props.ventilation_principle, vent_props.heat_exchange,
                                    vent_props.room_control, vent_props.notes, vent_props.db_technical,
                                    vent_props.db_neighbour, vent_props.db_corridor)
        log(f"new room id: {new_room_id}")
        dbo.initial_ventilation_calculations(new_room_id)
        

        return jsonify({"message": "Rom opprettet"})

@rooms_bp.route('/<project_id>/get_room/<room_id>/', methods=['GET'])
def get_room(project_id, room_id):
    room = dbo.get_room(room_id)
    room_data = room.get_json()
    #print(f"ROOM DATA IS: {room_data}")
    return jsonify({"room_data": room_data})


@rooms_bp.route('/<project_id>/update_room/<room_id>/', methods=['POST'])
@jwt_required()
def udpate_room(project_id, room_id):
    data = request.get_json()
    print(data)

    """ if request.method == "POST":
        data = request.get_json()
        project_id = escape(data["project_id"])
        room_id = escape(data["room_id"])
        processed_data = {}

        for key, value in data.items():
            if key == "population":
                processed_data[key] = pattern_int(escape(value).strip())
            elif key == "area":
                processed_data[key] = pattern_float(escape(value).strip())
            else:
                processed_data[key] = escape(value.strip())
        
        if dbo.update_room_data(room_id, processed_data):
            if dbo.update_ventilation_calculations(room_id):
                dbo.calculate_total_cooling_for_room(dbo.get_room(room_id).energy_properties.id)
                response = {"success": True, "redirect": url_for("rooms.rooms", project_id = project_id)}
        else:
            flash("Kunne ikke oppdatere romdata", category="error")
            response = {"success": False} """
    
    return jsonify({"message": f"Received data {room_id}"})

@rooms_bp.route('/delete_room/<room_id>/', methods=['POST'])
@jwt_required()
def delete_room(room_id):
    if request.method == "POST":
        data = request.get_json()
        received_room_id = escape(data["roomId"])
        if room_id != received_room_id:
            log(f"Delete room attempted with mismatch between endpoint room_id and json-data-room id")
            return jsonify({"message": "Feil i sletting av rom."})
        print(f"Room ID endpoint: {room_id}. JSON room-id: {received_room_id}")
        if dbo.delete_room(room_id):
            response = {"message": "Rom slettet"}
        else:
            response = {"message": "Kunne ikke slette rom"}
    return jsonify({"message": "Rom slettet"})
