from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_operations as dbo
from ..globals import replace_and_convert_to_float
from markupsafe import escape

specifications_bp = Blueprint('specifications',__name__, static_folder='static', template_folder='templates')

@specifications_bp.route('/', methods=['GET'])
#@jwt_required()
def specifications():
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.uid] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)

@specifications_bp.route('/get_specifications/', methods=['GET'])
def get_specifications():
    specifications = dbo.get_specifications()
    spec_data = {}
    for specification in specifications:
        spec_data[specification.uid] = specification.name
    spec_list = [{"id": key, "name": value} for key, value in spec_data.items()]
    return jsonify({"data": spec_list})

@specifications_bp.route('/get_spec_room_data/<spec_uid>/', methods=['GET'])
def get_spec(spec_uid):
    specification = dbo.get_specification_room_data(spec_uid)
    spec = dbo.get_specification(spec_uid)
    spec_name = spec.name
    specification_data = list(map(lambda x: x.get_json(), specification))
    if specification:
        return jsonify({"data": specification_data, "spec_name": spec_name})
    else:
        return jsonify({"error": "No specification found"}), 404


@specifications_bp.route('/get_spec_room_types/<spec_uid>/', methods=['GET'])
def get_specification_room_types(spec_uid):
    specification_data = dbo.get_specification_room_types(spec_uid)
    spec = dbo.get_specification(spec_uid)
    room_uid_type = {}
    for room_type in specification_data:
        room_uid_type[room_type.uid] = room_type.name
    room_types_list = [{"id": key, "name": value} for key, value in room_uid_type.items()]
    return jsonify({"spec_room_type_data": room_types_list})


@specifications_bp.route('/<specification>/new_room', methods=['GET', 'POST'])
@jwt_required()
def new_room(specification):
    endpoint = request.endpoint
    spec_object = dbo.get_specification_by_name(specification)
    if request.method == "GET":
        return render_template('add_room.html',
                                user=current_user,
                                specification=specification,
                                spec_object = spec_object,
                                endpoint=endpoint)
    
    if request.method == "POST":
        if request.is_json:
            data = request.get_json()
            processed_data = {}
            float_values = ["air_p_p", "air_emission", "air_process", "air_minimum"]
            for key, value in data.items():
                if key in float_values:
                    value = replace_and_convert_to_float(escape(value))
                    if value is False:
                        flash("Luftmengder skal kun inneholde tall", category="error")
                        response = {"success": False, "redirect": url_for('specifications.new_room', specification=specification)}
                        return jsonify(response)
                    else:
                        processed_data[key] = value
                else:
                    processed_data[key] = escape(value)

            if dbo.new_specification_room_type(processed_data["spec_id"], processed_data):
                response = {"success": True, "redirect": url_for('specifications.new_room', specification=specification)}
            else:
                flash("Kunne ikke lage nytt rom", category="error")
                response = {"success": False, "redirect": url_for('specifications.new_room', specification=specification)}
            return jsonify(response)
        else:
            return redirect(url_for('specifictaions.new_room', specification=specification))


@specifications_bp.route('/new_specification', methods=['GET', 'POST'])
@jwt_required()
def new_specification():
    endpoint = request.endpoint
    print(endpoint)
    if request.method == "GET":
        return render_template('new.html',
                            user=current_user,
                            specifications=specifications,
                            specification=None,
                            endpoint=endpoint)
    
    elif request.method == "POST":
        spec_name = escape(request.form.get("spec_name").strip())
        if dbo.find_specification_name(spec_name):
            flash("Spesifikasjon med det navnet finnes allerede", category="error")
            return redirect(url_for('specifications.new_specification'))
        else:
            dbo.new_specifitaion(spec_name)
            return redirect(url_for('specifications.specifications', specification=spec_name))
