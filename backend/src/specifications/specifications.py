import json
from flask import Blueprint, jsonify, request
from .. import db_operations as dbo
from ..globals import replace_and_convert_to_float
from markupsafe import escape
from functools import wraps
from firebase_admin import auth

specifications_bp = Blueprint('specifications',__name__, static_folder='static', template_folder='templates')
def firebase_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        id_token = request.headers.get('Authorization')
        #print(f"ID token received: {id_token}")
        if id_token is None:
            return jsonify({"success": False, "message": "Unauthorized"}), 401
        token = id_token.split(" ")[1]
        try:
            decoded_token = auth.verify_id_token(token)
            request.user = decoded_token
            uid = decoded_token['uid']
            request.user_uid = uid
            #print(f"UID: {uid}")
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 401
        return f(*args, **kwargs)
    return decorated_function
    
@specifications_bp.route('/', methods=['GET'])
@firebase_required
def specifications():
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.uid] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)


@specifications_bp.route('/get_specifications/', methods=['GET'])
@firebase_required
def get_specifications():
    specifications = dbo.get_specifications()
    spec_data = {}
    for specification in specifications:
        spec_data[specification.uid] = specification.get_json()
    return jsonify({"success": True, "data": spec_data})

@specifications_bp.route('/get_spec_room_data/<spec_uid>/', methods=['GET'])
@firebase_required
def get_spec(spec_uid):
    spec = dbo.get_specification(spec_uid)
    if spec:
        specification_room_types = dbo.get_specification_room_data(spec_uid)
        spec_name = spec.name
        if specification_room_types:
            specification_room_data = {}
            for room_type in specification_room_types:
                specification_room_data[room_type.uid] = room_type.get_json()
            return jsonify({"success": True, "data": specification_room_data, "spec_name": spec_name})
        return jsonify({"success": False, "message": "Ingen romtyper lagt inn", "spec_name": spec_name})
    else:
        return jsonify({"success": False, "message": "Fant ikke kravspesifikasjonen"})

@specifications_bp.route('/get_spec_rooms/<spec_uid>/', methods=['GET'])
@firebase_required
def get_spec_rooms(spec_uid):
    room_types = dbo.get_specification_room_data(spec_uid)
    if room_types:
        room_type_data = {}
        for room_type in room_types:
            room_type_data[room_type.name] = room_type.uid
        return jsonify({"success": True, "data": room_type_data})
    else:
        return jsonify({"success": False, "message": "Ingen romtyper lagt inn"})
    
@specifications_bp.route('/get_spec_room_types/<spec_uid>/', methods=['GET'])
@firebase_required
def get_specification_room_types(spec_uid):
    specification_data = dbo.get_specification_room_types(spec_uid)
    room_uid_type = {}
    for room_type in specification_data:
        room_uid_type[room_type.uid] = room_type.name
    room_types_list = [{"uid": key, "name": value} for key, value in room_uid_type.items()]
    return jsonify({"success": True, "data": room_types_list})

@specifications_bp.route('/new_room/<spec_uid>/', methods=['POST'])
@firebase_required
def new_room_for_spec(spec_uid):
    data = request.get_json()
    if data:
        float_values = ["air_per_person", "air_emission", "air_minimum", "air_process"]
        processed_data = {}
        for key, value in data.items():
            if key == "room_type":
                room_type = dbo.find_room_type_for_specification(spec_uid, value)
                if room_type is True:
                    return jsonify({"success": False, "message": f"Romtype {key} finnes allerede"})
                else:
                    processed_data[key] = escape(value).strip()
            if key in float_values:
                cleansed_value = escape(value).strip()
                converted_value = replace_and_convert_to_float(cleansed_value)
                if converted_value is False:
                    return jsonify({"success": False, "message": f"Luftmengder må kun inneholde tall"})
                else:
                    processed_data[key] = converted_value
            else:
                processed_data[key] = escape(value).strip()
        #print(f"Data: {processed_data}.")
        if dbo.new_specification_room_type(spec_uid, processed_data):
            return jsonify({"success": True, "message": "Rom lagt til"})
    return jsonify({"success": False, "message": "Kunne ikke legge til nytt rom."})

@specifications_bp.route('/new_specification/', methods=['POST'])
@firebase_required
def new_specification():
    data = request.get_json()
    if data:
        spec_name = escape(data["spec_name"])
        if dbo.find_specification_name(spec_name):
            return jsonify({"success": False, "message": f"Kravspesifikasjon {spec_name} finnes allerede i databasen"})
        else:
            new_spec = dbo.new_specifitaion(spec_name)
            if new_spec is not None:
                return jsonify({"success": True, "message": "Kravspesfikasjon opprettet", "data": new_spec})
            else:
                return jsonify({"success": False, "error": "Kunne ikke opprette ny kravspesifikasjon"})
    else:
        return jsonify({"success": False, "message": "Ingen data mottatt"})

@specifications_bp.route('/delete_spec_room_type/<room_type_uid>/', methods=['DELETE'])
@firebase_required
def delete_spec_room_type(room_type_uid):
    room = dbo.get_room_type(room_type_uid)
    if room:
        if dbo.delete_room_type_from_spec(room_type_uid):
            return jsonify({"success": True, "message": f"Romtype {room.name} slettet"})
        else:
            return jsonify({"success": False, "message": f"Kunne ikke slette romtype {room.name}"})
    else:
        return jsonify({"success": False, "message": f"Fant ikke romtype {room.name}"})

@specifications_bp.route('/get_room_type_data/<room_uid>/', methods=['GET'])
@firebase_required
def get_room_type_data(room_uid):
    room_data = dbo.get_spec_room_type_data(room_uid)
    
    if room_data:
        return jsonify({"success": True, "message": "Room type data", "data": room_data})
    else:
        return jsonify({"success": False, "message": "No room type data found"})

@specifications_bp.route('/delete_room_type/<room_uid>/', methods=['DELETE'])
@firebase_required
def delete_room_type(room_uid):
    deleted_room = dbo.delete_room_type_from_spec(room_uid)
    if deleted_room:
        return jsonify({"success": True, "message": "Room deleted"})
    else:
        return jsonify({"success": False, "error": "Kunne ikke slette rom"})


@specifications_bp.route('/delete_spec/<spec_uid>/', methods=['DELETE'])
@firebase_required
def delete_spec(spec_uid):
    spec = dbo.get_specification(spec_uid)
    if spec:
        if dbo.delete_all_room_types_spec(spec_uid) is not False:
            if dbo.delete_specification(spec_uid):
                return jsonify({"success": True, "message": "Spesifikasjon og tilhørende romtyper slettet"})
            else:
                return jsonify({"success": False, "message": f"Kunne ikke slette kravspesifikasjon {spec.name}"})
        else:
            return jsonify({"success": False, "message": f"Kunne ikke slette romtyper for {spec.name} "})
    else:
        return jsonify({"success": False, "message": f"Fant ingen kravspesifikasjon med id {spec_uid}"})


@specifications_bp.route('/update_room/<room_uid>/', methods=['PATCH'])
@firebase_required
def update_room(room_uid):
    data = request.get_json()
    if data:
        processed_data = {}
        float_values = ["air_per_person", "air_emission", "air_process", "air_minimum"]
        for key, value in data.items():
            if key == "room_control":
                if "vav" in value.lower() and "cav" in value.lower():
                    return jsonify({"success": False, "error": "Styring må ha enten CAV eller VAV, ikke begge deler"})
                
            if key in float_values:
                converted_value = replace_and_convert_to_float(value)
                if converted_value is not False:
                    processed_data[key] = converted_value
                else:
                    return jsonify({"success": False, "error": "Luftmengde må kun inneholde tall"})
            else:
                processed_data[key] = value.strip()
        if dbo.update_room_type_data(processed_data, room_uid):
            return jsonify({"success": True, "message": "Updated room"})
        else:
            return jsonify({"success": False, "error": "Kunne ikke oppdatere romdata"})
    return jsonify({"success": False, "message": "Mottok ingen data"})
        

        