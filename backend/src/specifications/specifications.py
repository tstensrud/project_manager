import json
from datetime import datetime, timezone, timedelta
#import pandas as pd
from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, jwt_required
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from ..globals import replace_and_convert_to_float
from markupsafe import escape

specifications_bp = Blueprint('specifications',__name__, static_folder='static', template_folder='templates')
@specifications_bp.after_request
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
    
@specifications_bp.route('/', methods=['GET'])
@jwt_required()
def specifications():
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.uid] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)


@specifications_bp.route('/get_specifications/', methods=['GET'])
@jwt_required()
def get_specifications():
    specifications = dbo.get_specifications()
    spec_data = {}
    for specification in specifications:
        spec_data[specification.uid] = specification.get_json()
    return jsonify({"success": True, "data": spec_data})

@specifications_bp.route('/get_spec_room_data/<spec_uid>/', methods=['GET'])
@jwt_required()
def get_spec(spec_uid):
    specification = dbo.get_specification_room_data(spec_uid)
    spec = dbo.get_specification(spec_uid)
    spec_name = spec.name
    specification_data = list(map(lambda x: x.get_json(), specification))
    if specification:
        return jsonify({"data": specification_data, "spec_name": spec_name})
    else:
        return jsonify({"error": "Ingen romdata lagt inn", "spec_name": spec_name})

@specifications_bp.route('/get_spec_rooms/<spec_uid>/', methods=['GET'])
@jwt_required()
def get_spec_rooms(spec_uid):
    room_types = dbo.get_specification_room_data(spec_uid)
    if room_types:
        uids = []
        for room_type in room_types:
            uids.append(room_type.uid)
        return jsonify({"success": True, "message": "Roomtype UIDs", "data": uids})
    else:
        return jsonify({"success": False, "message": "No roomtypes found"})
    
@specifications_bp.route('/get_spec_room_types/<spec_uid>/', methods=['GET'])
@jwt_required()
def get_specification_room_types(spec_uid):
    specification_data = dbo.get_specification_room_types(spec_uid)
    room_uid_type = {}
    for room_type in specification_data:
        room_uid_type[room_type.uid] = room_type.name
    room_types_list = [{"uid": key, "name": value} for key, value in room_uid_type.items()]
    return jsonify({"data": room_types_list})

""" @jwt_required()

@specifications_bp.route('/new_rooms/<spec_uid>/', methods=['POST'])
def new_room(spec_uid):
    file = request.files['file']
    #spec = dbo.get_specification_by_name(spec_uid)
    if 'file' not in request.files:
        return jsonify({"error": "Ingen fil lagt ved"})
    if file.filename == '':
        return jsonify({"error": "Ingen fil mottatt"})
    
    df = pd.read_csv(file, sep=";")
    file_columns = []
    for index, row in df.iterrows():
        for column in df.columns:
            value = row[column]
            print(f"Value in column {column}: {value}")
    
    return jsonify({"message": "Fil mottatt"}) """

@specifications_bp.route('/new_room/<spec_uid>/', methods=['POST'])
@jwt_required()
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
                    print(f"Could not convert value: {value}")
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
def get_room_type_data(room_uid):
    room_data = dbo.get_spec_room_type_data(room_uid)
    
    if room_data:
        return jsonify({"success": True, "message": "Room type data", "data": room_data})
    else:
        return jsonify({"success": False, "message": "No room type data found"})

@specifications_bp.route('/delete_room_type/<room_uid>/', methods=['DELETE'])
@jwt_required()
def delete_room_type(room_uid):
    print(room_uid)
    deleted_room = dbo.delete_room_type_from_spec(room_uid)
    if deleted_room:
        return jsonify({"success": True, "message": "Room deleted"})
    else:
        return jsonify({"success": False, "error": "Kunne ikke slette rom"})


@specifications_bp.route('/delete_spec/<spec_uid>/', methods=['DELETE'])
@jwt_required()
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
@jwt_required()
def update_room(room_uid):
    data = request.get_json()
    print(data)
    if data:
        processed_data = {}
        float_values = ["air_per_person", "air_emission", "air_process", "air_minimum"]
        for key, value in data.items():
            if key == "room_control":
                if "vav" in value.lower() and "cav" in value.lower():
                    return jsonify({"success": False, "error": "Styring må ha enten CAV eller VAV, ikke begge deler"})
                
            escaped_value = escape(value).strip()
            if key in float_values:
                converted_value = replace_and_convert_to_float(escaped_value)
                if converted_value is not False:
                    processed_data[key] = converted_value
                else:
                    return jsonify({"success": False, "error": "Luftmengde må kun inneholde tall"})
            else:
                processed_data[key] = escape(value).strip()
        if dbo.update_room_type_data(processed_data, room_uid):
            return jsonify({"success": True, "message": "Updated room"})
        else:
            return jsonify({"success": False, "error": "Kunne ikke oppdatere romdata"})
        

        