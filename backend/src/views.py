from datetime import datetime, timezone, timedelta
import os
import json
import random
from uuid import uuid4
from werkzeug.security import generate_password_hash
from flask import Blueprint, request, jsonify
from . import models, db, globals
from .models import User
from . import db_operations as dbo
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager, verify_jwt_in_request
from markupsafe import escape

views = Blueprint("views", __name__)

'''
Views
'''
@views.after_request
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

@views.route('/', methods=['GET'])
def index():
    return jsonify({"Nothing": "here"})

""" @views.route('/test/', methods=['GET'])
def test():
    #test = dbo.sum_airflow_supply_floor_building("8dLbgOmLRqmNEjB5_8Esmw", "01")
    systems = dbo.systems_in_building("8dLbgOmLRqmNEjB5_8Esmw")
    systems.pop(systems.index(None))
    print(systems)
     
    return jsonify({"8dLbgOmLRqmNEjB5_8Esmw": "test"}) """

@views.route('/verify-token/', methods=['GET'])
def verify_token():
    try:
        verify_jwt_in_request()
        user_identity = get_jwt_identity()
        return jsonify({"valie": True, "user": user_identity}), 200
    except:
        return jsonify({"valid": False}), 401

@views.route('/token/', methods=['GET', 'POST'])
def token():
    if request.method == 'POST':
        email = escape(request.json.get("email"))
        password =  escape(request.json.get("password"))

        user = User.query.filter_by(email=email).first()
        if user:
            user_uuid = user.uuid
            if check_password_hash(user.password, password):
                access_token = create_access_token(identity=user_uuid)
                response = {"access_token": access_token, "uuid": user.uuid, "username": user.name}
                user.logged_in = True
                db.session.commit()
                return jsonify(response)
            else:
                return jsonify({"error": "Feil brukernavn eller passord"}), 401
        else:
            return jsonify({"error": "Feil brukernavn eller passord"}), 401
    if request.method == "GET":
        return jsonify({"Message": "Nothing here"})

@jwt_required()
@views.route('/get_user/', methods=['GET'])
def get_user():
    verify_jwt_in_request()
    user_identiy = get_jwt_identity()
    user = db.session.query(models.User).filter(models.User.uuid == user_identiy).first()
    user_data = {}
    user_data["uuid"] = user.uuid
    user_data["email"] = user.email
    user_data["name"] = user.name
    if user:
        print(user_data)
        return jsonify({"user": user_data})
    else:
        return jsonify({"error": "Could not fetch user data"})
    

@views.route('/logout/<user_uid>/', methods=["POST"])
def logout(user_uid):
    user = db.session.query(models.User).filter(models.User.uuid == user_uid).first()
    user.logged_in = False
    db.session.commit()
    response = jsonify({"message": "user logged out"})
    unset_jwt_cookies(response)
    return response

@views.route('/initialize', methods=['GET'])
def initialize():
        
    email = "admin"
    name = "Administrator"
    password = "1234"
    uuid = globals.encode_uid_base64(uuid4())
    user = models.User.query.filter_by(email=email).first()
    if not user:
        admin_account = models.User(uuid=str(uuid), email=email, name=name, password = generate_password_hash(password, method='scrypt'), logged_in=False, admin=True, is_active=True)
        db.session.add(admin_account)
        db.session.commit()
        print("Admin account created")
    if spec_rooms_setup():
        dummy_project()
    else:
        return jsonify({"error": "Failed to initialize app"})
    return jsonify({"success": "App initialized"})

@views.route('/test', methods=['GET'])
def test():
    return jsonify({"message": "Hello"})

'''
Set up default specifications
'''
def spec_rooms_setup() -> bool:

    names = ["Skok skoler 2022-o2023", "Skok flerbrukshaller 2022-o2023"]
    
    for name in names:
        uid = globals.encode_uid_base64(uuid4())
        spec = models.Specifications(uid=uid, name=name)
        db.session.add(spec)
        try:
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
                                    air_minimum = values[3],
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
def dummy_project():
    new_project = dbo.new_project("123456", "Dummy project", "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus voluptatem odio vitae pariatur sint ipsum possimus porro, molestias ab sunt quidem sit quasi vel vero. Earum, ut? Dolorum, ipsa recusandae?")
    spec = dbo.get_specification_by_row(1)
    dbo.set_project_specification(new_project.uid, spec.uid)
    for i in range(4):
        dbo.new_building(new_project.uid, f"Bygg {i}")
    floors = ["01", "10", "20", "30", "40"]
    heat_ex = ["R", "P"]
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


        new_room = dbo.new_room(new_project.uid, building.uid, room_type.uid, floor, room_number, f"Navn{i}", area, pop,
                     room_type.air_per_person, room_type.air_emission, room_type.air_process, room_type.air_minimum,
                     room_type.ventilation_principle, room_type.heat_exchange, room_type.room_control,
                     room_type.notes, room_type.db_technical, room_type.db_neighbour, room_type.db_corridor)
        dbo.initial_ventilation_calculations(new_room)
    
        


    




    



