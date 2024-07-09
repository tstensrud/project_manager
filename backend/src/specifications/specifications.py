import os
from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from ..globals import replace_and_convert_to_float
from markupsafe import escape

specifications_bp = Blueprint('specifications',__name__, static_folder='static', template_folder='templates')

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
    print(spec_uid)
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
    print("New spec")
    spec = dbo.get_specification_by_name(spec_uid)
    if 'file' not in request.files:
        print("No file 1")
        return jsonify({"error": "Ingen fil lagt ved"})
    file = request.files['file']
    print(f"File: {file}")
    if file.filename == '':
        print("No file 2")
        return jsonify({"error": "Ingen fil mottatt"})
    
    print(f"File received: {file}")
    
    file.save(os.path.join('./templates/', file.filename))
    return jsonify({"message": "Fil mottatt"})

    


@jwt_required()
@specifications_bp.route('/new_specification/', methods=['POST'])
def new_specification():
    data = request.get_json()
    print(data)
    spec_name = escape(data["spec_name"])
    if dbo.find_specification_name(spec_name):
        return jsonify({"error", f"Kravspesifikasjon {spec_name} finnes allerede i databasen"})
    else:
        dbo.new_specifitaion(spec_name)
        return jsonify({"response": "Kravspesfikasjon opprettet"})
