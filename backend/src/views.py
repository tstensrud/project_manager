from datetime import datetime, timezone, timedelta
import os
import json
from uuid import uuid4
from werkzeug.security import generate_password_hash
from flask_login import current_user
from flask import Blueprint, request, jsonify
from . import models, db, globals
from .models import User
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, get_jwt, get_jwt_identity, unset_jwt_cookies, jwt_required, JWTManager

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


@views.route('/token', methods=['GET', 'POST'])
def token():
    if request.method == 'POST':
        email = request.json.get("email")
        password =  request.json.get("password")

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                access_token = create_access_token(identity=email)
                response = {"access_token": access_token, "uuid": user.uuid, "username": user.name}
                user.logged_in = True
                db.session.commit()
                return response
            else:
                return jsonify({"Error": "Feil passord eller brukernavn"}), 401
        else:
            return jsonify({"Error": "Fant ikke bruker"}), 401
    if request.method == "GET":
        return jsonify({"Message": "Nothing here"})

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
        return jsonify({"message": "project initialized"})
    else:
        return jsonify({"error": "project failed to initialize"})
        

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


