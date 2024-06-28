
from flask import Blueprint, jsonify, request
from .. import db_operations as dbo
from .. import globals
from flask_jwt_extended import jwt_required
from markupsafe import escape
import json

buildings_bp = Blueprint('buildings', __name__, static_folder='static', template_folder='templates')
globals.blueprint_setup(buildings_bp)

@buildings_bp.route('/<project_id>/', methods=['GET'])
@jwt_required()
def buildings(project_id):
    buildings = dbo.get_all_project_buildings(project_id)


    if request.method == "GET":
        if buildings is None:
            print("Return nothing")
            return jsonify({"building_data": None})
        else:
            building_data = {}
            for building in buildings:
                building_data[building.id] = dbo.get_building_data(building.id)
            return jsonify({"building_data": building_data})

@buildings_bp.route('/<project_id>/get_project_buildings/', methods=["GET"])
#@jwt_required()
def get_project_buildings(project_id):
    buildings = dbo.get_all_project_buildings(project_id)

    if buildings is None:
        return jsonify({"building_data": None})
    else:
        building_data = {}
        for building in buildings:
            building_data[building.id] = building.building_name
        return jsonify({"building_data": building_data})


@buildings_bp.route('/<project_id>/new_building/', methods=["POST"])
@jwt_required()
def new_building(project_id):
    data = request.get_json()
    name = escape(data["buildingName"])
    if not data:
        return jsonify({"building_data": "No data received"})
    else:
        if dbo.new_building(project_id, name):
            return jsonify({"building_data": "Success"})
        else:
            return jsonify({"building_data": "Could not add new building"})