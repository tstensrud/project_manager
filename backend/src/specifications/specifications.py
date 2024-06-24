from flask import Blueprint, redirect, url_for, render_template, flash, jsonify, request
from flask_login import login_required, current_user
from .. import db_operations as dbo
from ..globals import replace_and_convert_to_float
from markupsafe import escape

specifications_bp = Blueprint('specifications',__name__, static_folder='static', template_folder='templates')

@specifications_bp.route('/', methods=['GET', 'POST'])
#@specifications_bp.route('/<specification>', methods=['GET', 'POST'])
#@login_required
def specifications():
    print("TEST")
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.id] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)

@specifications_bp.route('/get_spec_room_types', methods=['GET'])
def get_specification_room_types():
    spec = "Skok skoler 2022-o2023"
    specification_data = dbo.get_specification_room_types(spec)
    room_id_type = {}
    for object in specification_data:
        room_id_type[object.id] = object.name
    room_types_list = [{"id": key, "name": value} for key, value in room_id_type.items()]
    return jsonify(room_types_list)


@specifications_bp.route('/<specification>/new_room', methods=['GET', 'POST'])
@login_required
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
@login_required
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
