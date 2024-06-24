
from flask import Blueprint, redirect, url_for, render_template, flash, request
from flask_login import login_required, current_user
from .. import db_operations as dbo
from .. import db_ops_energy as dboh
from .. import globals
from markupsafe import escape

buildings_bp = Blueprint('buildings', __name__, static_folder='static', template_folder='templates')
globals.blueprint_setup(buildings_bp)

@buildings_bp.route('/', methods=['POST', 'GET'])
@login_required
def buildings(project_id):
    project = dbo.get_project(project_id)
    endpoint = request.endpoint
   
    if request.method == "GET":
        project_buildings = dbo.get_all_project_buildings(project.id)
        
        
        building_areas = []
        building_supply = []
        building_extract = []
        building_heating = []
        for building in project_buildings:
            building_areas.append(dbo.summarize_building_area(project.id, building.id))
            building_supply.append(dbo.summarize_supply_air_building(project.id, building.id))
            building_extract.append(dbo.summarize_extract_air_building(project.id, building.id))
            building_heating.append(dboh.sum_heat_loss_chosen_building(building.id))

        ziped_building_data = zip(project_buildings, building_areas, building_supply, building_extract, building_heating)

        return render_template("buildings.html", 
                               user=current_user, 
                               project=project, 
                               project_buildings = ziped_building_data,
                               endpoint=endpoint,
                               project_id = project.id)
   
    elif request.method == "POST":
        building_name = escape(request.form.get("building_name").strip())
        if dbo.new_building(project.id, building_name):
            flash(f"Bygg {building_name} opprettet", category="success")
            return redirect(url_for('buildings.buildings', project_id = project.id))
        else:
            flash(f"Kunne ikke opprette bygg", category="error")
            return redirect(url_for('buildings.buildings', project_id = project.id))