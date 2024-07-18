import os
import json
from datetime import datetime, timezone, timedelta
import pandas as pd
from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import current_user
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager
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
    
@jwt_required()
@specifications_bp.route('/', methods=['GET'])
def specifications():
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.uid] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)

@jwt_required()
@specifications_bp.route('/get_specifications/', methods=['GET'])
def get_specifications():
    specifications = dbo.get_specifications()
    spec_data = {}
    for specification in specifications:
        spec_data[specification.uid] = specification.name
    spec_list = [{"id": key, "name": value} for key, value in spec_data.items()]
    return jsonify({"data": spec_list})

@jwt_required()
@specifications_bp.route('/get_spec_room_data/<spec_uid>/', methods=['GET'])
def get_spec(spec_uid):
    specification = dbo.get_specification_room_data(spec_uid)
    spec = dbo.get_specification(spec_uid)
    spec_name = spec.name
    specification_data = list(map(lambda x: x.get_json(), specification))
    if specification:
        return jsonify({"data": specification_data, "spec_name": spec_name})
    else:
        return jsonify({"error": "Ingen romdata lagt inn"})
    
@jwt_required()
@specifications_bp.route('/get_spec_room_types/<spec_uid>/', methods=['GET'])
def get_specification_room_types(spec_uid):
    specification_data = dbo.get_specification_room_types(spec_uid)
    spec = dbo.get_specification(spec_uid)
    room_uid_type = {}
    for room_type in specification_data:
        room_uid_type[room_type.uid] = room_type.name
    room_types_list = [{"uid": key, "name": value} for key, value in room_uid_type.items()]
    return jsonify({"spec_room_type_data": room_types_list})

@jwt_required()
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
    
    return jsonify({"message": "Fil mottatt"})

@jwt_required()
@specifications_bp.route('/new_room/<spec_uid>/', methods=['POST'])
def new_room_for_spec(spec_uid):
    data = request.get_json()
    if data:
        float_values = ["air_per_person", "air_emission", "air_minimum", "air_process"]
        processed_data = {}
        for key, value in data.items():
            if key == "room_type":
                room_type = dbo.find_room_type_for_specification(spec_uid, value)
                if room_type is True:
                    return jsonify({f"error_{key}": "Romtype finnes allerede"})
                else:
                    processed_data[key] = escape(value).strip()
            if key in float_values:
                cleansed_value = escape(value).strip()
                converted_value = replace_and_convert_to_float(cleansed_value)
                if converted_value is False:
                    print(f"Could not convert value: {value}")
                    return jsonify({f"error_{key}": "Luftmengder må kun inneholde tall"})
                else:
                    processed_data[key] = converted_value
            else:
                processed_data[key] = escape(value).strip()
        print(f"Data: {processed_data}.")
        if dbo.new_specification_room_type(spec_uid, processed_data):
            return jsonify({"success": "Rom lagt til"})
    return jsonify({"error", "Kunne ikke legge til nytt rom."})


@jwt_required()
@specifications_bp.route('/new_specification/', methods=['POST'])
def new_specification():
    data = request.get_json()
    spec_name = escape(data["spec_name"])
    if dbo.find_specification_name(spec_name):
        return jsonify({"error", f"Kravspesifikasjon {spec_name} finnes allerede i databasen"})
    else:
        dbo.new_specifitaion(spec_name)
        return jsonify({"response": "Kravspesfikasjon opprettet"})
