import os
import json
import time
import random
import string
from uuid import uuid4
from flask import Blueprint, jsonify, send_from_directory
from . import models, db, globals
from . import db_operations as dbo
from werkzeug.security import check_password_hash

views = Blueprint("views", __name__)

'''
Views
'''
@views.route('/', methods=['GET'])
def index():
    return jsonify({"Root": "Structor TS"})

""" @views.route('/test/', methods=['GET'])
def test():
    #test = dbo.sum_airflow_supply_floor_building("8dLbgOmLRqmNEjB5_8Esmw", "01")
    systems = dbo.systems_in_building("8dLbgOmLRqmNEjB5_8Esmw")
    systems.pop(systems.index(None))
    print(systems)
     
    return jsonify({"8dLbgOmLRqmNEjB5_8Esmw": "test"}) """

@views.route('/excel/download/<filename>')
def download_file(filename):
    directory = os.path.join('..', 'static', 'excel')
    return send_from_directory(directory, filename, as_attachment=True)

@views.route('/logout/<user_uid>/', methods=["POST"])
def logout(user_uid):
    user = db.session.query(models.Users).filter(models.Users.uuid == user_uid).first()
    user.logged_in = False
    try:
        db.session.commit()
    except Exception as e:
        print(e)
    response = jsonify({"message": "user logged out"})
    return jsonify({"message": "user logged out"})
    
""" @views.route('/rename/', methods=['GET'])
def rename():
    rooms = db.session.query(models.Rooms).all()
    for room in rooms:
        room_name = ''.join(random.choices(string.ascii_letters, k=10))
        room.room_name = room_name
    try:
        db.session.commit()
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"success": False, "message": f"{str(e)}"}) """
    
""" @views.route('/initialize', methods=['GET'])
def initialize():
        
    email = "admin"
    name = "Administrator"
    password = "1234"
    uuid = globals.encode_uid_base64(uuid4())
    user = models.Users.query.filter_by(email=email).first()
    if not user:
        admin_account = models.Users(uuid=str(uuid), email=email, name=name, password = generate_password_hash(password, method='scrypt'), logged_in=False, admin=True, is_active=True)
        db.session.add(admin_account)
        db.session.commit()
    if spec_rooms_setup():
        set_sanitary_equipment_data()
        create_test_projects()
    else:
        return jsonify({"error": "Failed to initialize app"})
    return jsonify({"success": "App initialized"}) """

""" @views.route('/testprojects/', methods=['GET'])
def testprojects():
    projects = create_test_projects()
    if projects:
        return jsonify({"success": True})
    return jsonify({"success": False}) """

""" @views.route('/spec/', methods=['GET'])
def specs():
    spec_setup = spec_rooms_setup()
    if spec_setup:
        return jsonify({"success": True})
    return jsonify({"success": False}) """

#@views.route('/create_test_projects', methods=['GET'])
def create_test_projects() -> bool:
    oslo_street_names = [
    "Karl Johans gate", "Bogstadveien", "Dronningens gate", "Torggata", "Storgata",
    "Grünerløkka gate", "Frognerveien", "Sørkedalsveien", "Bygdøy allé", "Pilestredet",
    "Thorvald Meyers gate", "Trondheimsveien", "Maridalsveien", "Ullevålsveien", "Holmenkollveien",
    "Parkveien", "Kirkeveien", "Oscars gate", "Møllergata", "Bjørvika allé",
    "Hegdehaugsveien", "Schweigaards gate", "Hausmanns gate", "Vogts gate", "Skippergata",
    "Sofienberggata", "Grefsenveien", "Kongsveien", "Munkedamsveien", "Dælenenggata",
    "Sandakerveien", "Uranienborgveien", "Langgata", "Fjordgata", "Lilletorget",
    "Sinsenveien", "Majorstuveien", "Hammersborggata", "Skillebekkveien", "Middelthunsgate",
    "Lille Grensen", "Fredensborgveien", "Sagveien", "Tøyengata", "Skovveien",
    "Bergsalléen", "Bislettgata", "Øvre Slottsgate", "Hovinveien", "Kjølberggata"
    ]
    random_numbers = [
    639852, 604719, 659028, 633715, 681245, 662908, 675431, 620387, 640258, 605671,
    621043, 680473, 607385, 698234, 684512, 671023, 697831, 627384, 654021, 610238,
    690432, 676193, 603285, 665293, 609478, 638204, 629471, 613847, 653920, 648302,
    668321, 622403, 636781, 687549, 669482, 609345, 695432, 604738, 621845, 672093,
    646920, 600174, 681045, 692341, 626485, 630295, 601843, 677492, 634801, 619305
    ]

    try:
        for i in range(len(oslo_street_names)):
            dummy_project(project_name=oslo_street_names[i], project_number=random_numbers[i])
        #return jsonify({"message": "done"})
        return True
    except Exception as e:
        return False


    
'''
Set up default specifications
'''
def spec_rooms_setup() -> bool:

    names = ["Skok skoler 2022-o2023", "Skok flerbrukshaller 2022-o2023"]
    
    for name in names:
        uid = globals.encode_uid_base64(uuid4())
        timestamp = int(time.time() * 1000)
        spec = models.Specifications(uid=uid, name=name, created_at=timestamp, created_by="Admin")
        try:
            db.session.add(spec)
            db.session.commit()
        except Exception as e:
            return f"Could not create {name}, {e}"

    
        spec = models.Specifications.query.filter_by(name=name).first()
        
        json_file_path = os.path.join(os.path.dirname(__file__), "static", f"specifications/{name}.json")
        with open(json_file_path, encoding="utf-8") as jfile:
            data = json.load(jfile)

        
        for key, value in data.items():
            key = key.capitalize()
            key = key.replace("_", " ")
            values = []
            for _, value in value.items():
                values.append(value)
            uid = globals.encode_uid_base64(uuid4())
            room = models.RoomTypes(uid=uid,
                                    specification_uid=spec.uid,
                                    name=key,
                                    air_per_person = values[0],
                                    air_emission = values[1],
                                    air_process = values[2],
                                    air_minimum = 0.0,
                                    air_per_area = values[3],
                                    ventilation_principle = values[4],
                                    heat_exchange = values[5],
                                    room_control = values[6],
                                    notes = values[7],
                                    db_technical = values[8],
                                    db_neighbour= values[9],
                                    db_corridor = values[10],
                                    comments = values[11])
            try:
                db.session.add(room)
                db.session.commit()
            except Exception as e:
                return False
    
    return True


'''
Create dummy project
'''
def dummy_project(project_name=None, project_number=None):

    if project_name and project_number is None:
        project_name = "Dummy project"
        project_number = "123456"    

    room_name = ''.join(random.choices(string.ascii_letters, k=10))
    new_project = dbo.new_project(f"{project_number}", f"{project_name}-D", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus voluptatem odio vitae pariatur sint ipsum possimus porro, molestias ab sunt quidem sit quasi vel vero. Earum, ut? Dolorum, ipsa recusandae?")
    spec = dbo.get_specification_by_row(1)
    dbo.set_project_specification(new_project.uid, spec.uid)
    for i in range(4):
        dbo.new_building(new_project.uid, f"Bygg {i}")
    floors = ["01", "10", "20", "30", "40"]
    heat_ex = ["R", "P", "B"]
    buildings = dbo.get_all_project_buildings(new_project.uid)
    spec_room_types = dbo.get_specification_room_types(spec.uid)

    for i in range(9):
        airflow = random.randint(2000,25000)
        heatex = random.choice(heat_ex)
        dbo.new_ventilation_system(new_project.uid, f"360.00{i}", f"Plassering {i}", f"Betjener område {i}", heatex, airflow, "")
    

    for i in range(200):
        building = random.choice(buildings)
        room_type = random.choice(spec_room_types)
        area = random.randint(5,100)
        pop = random.randint(1,70)
        floor = random.choice(floors)
        number = random.randint(100,999)
        room_number = f"{floor}{number}"


        new_room = dbo.new_room(new_project.uid, building.uid, room_type.uid, floor, room_number, room_name, area, pop,
                     room_type.air_per_person, room_type.air_emission, room_type.air_process, room_type.air_per_area,
                     room_type.ventilation_principle, room_type.heat_exchange, room_type.room_control,
                     room_type.notes, room_type.db_technical, room_type.db_neighbour, room_type.db_corridor)
        dbo.initial_ventilation_calculations(new_room)
    
'''
Sanitary equipment data
'''
def set_sanitary_equipment_data():
    equipment = [
        ["drinking_fountain", 0.1, 0.0, 0.1],
        ["sink_1_14_inch", 0.1, 0.1, 0.3],
        ["sink_large", 0.1, 0.1, 0.4],
        ["wc", 0.1, 0.0, 1.8],
        ["urinal", 0.4, 0.0, 0.4],
        ["shower", 0.2, 0.2, 0.4],
        ["tub", 0.3, 0.3, 0.9],
        ["dishwasher", 0.2, 0.0, 0.6],
        ["washing_machine", 0.2, 0.2, 0.6],
        ["tap_water_outlet_inside", 0.2, 0.2, 0.0],
        ["tap_water_outlet_outside", 0.2, 0.2, 0.0],
        ["sink_utility", 0.2, 0.2, 0.9],
        ["firehose", 0.2, 0.2, 0.0],
        ["drain_75_mm", 0.0, 0.0, 1.2],
        ["drain_110_mm", 0.0, 0.0, 2.0],
    ]
    
    for i in range(len(equipment)):
        equipment_type = models.SanitaryEquipmentWaterData(equipment_type=equipment[i][0],
                                                      water_flow_cold_water = equipment[i][1],
                                                      water_flow_warm_water = equipment[i][2],
                                                      water_flow_drainage = equipment[i][3])
        db.session.add(equipment_type)
    db.session.commit()
        

            

    
    




    



