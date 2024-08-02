from . import db
from flask_login import UserMixin
from sqlalchemy.sql import func

class User(db.Model, UserMixin):
    __tablename__ = 'Users'
    id = db.Column(db.Integer, primary_key=True, autoincrement = True)
    uuid = db.Column(db.String(250), unique=True)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(250), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    logged_in = db.Column(db.Boolean, default=False)
    admin = db.Column(db.Boolean, default=False)
    is_active = db.Column(db.Boolean, default=True)

    todo_item = db.relationship('TodoItem', backref='user', uselist=False, lazy=True)

    def get_json(self):
        return {
            "id": self.id,
            "uuid": self.uuid,
            "email": self.email,
            "password": self.password,
            "name": self.name,
            "logged_in": self.logged_in,
            "admin": self.admin,
            "is_active": self.is_active
        }


'''
# TODO-items
'''
class TodoItem(db.Model):
    __tablename__ = "TodoItem"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)
    project_uid = db.Column(db.String(250), db.ForeignKey('Projects.uid'), nullable=False)
    author_uid = db.Column(db.String(250), db.ForeignKey('Users.uuid'), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    content = db.Column(db.Text, nullable=False)
    completed = db.Column(db.Boolean, default=False)
    date_completed = db.Column(db.String(10))
    completed_by = db.Column(db.String(100))

    
    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "project_uid": self.project_uid,
            "author_uid": self.author_uid,
            "date": self.date,
            "content": self.content,
            "completed": self.completed,
            "date_completed": self.date_completed,
            "completed_by": self.completed_by
        }

class Projects(db.Model):
    __tablename__ = "Projects"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)
    project_number = db.Column(db.Integer, nullable=False)
    project_name = db.Column(db.String(50), nullable=False)
    project_description = db.Column(db.Text)
    specification = db.Column(db.String(50))

    todo_item = db.relationship('TodoItem', backref='project', uselist=False, lazy=True)
    buildings = db.relationship('Buildings', backref='project_buildings', uselist=False, lazy=True)
    ventilation_systems = db.relationship('VentilationSystems', backref='project_ventilation_systems', uselist=False, lazy=True)
    
    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "ProjectNumber": self.project_number,
            "ProjectName": self.project_name,
            "ProjectDescription": self.project_description,
            "Specification": self.specification
        }

class Buildings(db.Model):
    __tablename__ = "Buildings"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)
    project_uid = db.Column(db.String(250), db.ForeignKey('Projects.uid'), nullable=False)
    building_name = db.Column(db.String(100), nullable=False)
    inside_temp = db.Column(db.Float)
    vent_temp = db.Column(db.Float)
    infiltration = db.Column(db.Float)
    u_value_outer_wall = db.Column(db.Float)
    u_value_window_doors = db.Column(db.Float)
    u_value_floor_ground = db.Column(db.Float)
    u_value_floor_air = db.Column(db.Float)
    u_value_roof = db.Column(db.Float)
    cold_bridge_value = db.Column(db.Float)
    year_mid_temp = db.Column(db.Float)
    temp_floor_air = db.Column(db.Float)
    dut = db.Column(db.Float)
    safety = db.Column(db.Integer)

    rooms = db.relationship('Rooms', backref='building', lazy=True)

    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "ProjectId": self.project_uid,
            "BuildingName": self.building_name,
            "InsideTemp": self.inside_temp,
            "VentTemp": self.vent_temp,
            "Infiltration": self.infiltration,
            "UvalueOuterWall": self.u_value_outer_wall,
            "UvalueWindowDoor": self.u_value_window_doors,
            "UvalueFloorGround": self.u_value_floor_ground,
            "UvalueFloorAir": self.u_value_floor_air,
            "UvalueRoof": self.u_value_roof,
            "ColdBridge": self.cold_bridge_value,
            "YearMidTemp": self.year_mid_temp,
            "TempFloorAir": self.temp_floor_air,
            "Dut": self.dut,
            "Safety": self.safety
        }

class Rooms(db.Model):
    __tablename__ = "Rooms"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)

    # Foreign keys
    project_uid = db.Column(db.String(250), db.ForeignKey('Projects.uid'), nullable=False)
    building_uid = db.Column(db.String(250), db.ForeignKey('Buildings.uid'), nullable=False)
    room_type_uid = db.Column(db.String(250), db.ForeignKey('RoomTypes.uid'), nullable=False)
    system_uid = db.Column(db.String(250), db.ForeignKey('VentilationSystems.uid', ondelete="SET NULL"), nullable=True)

    # Basic room data
    floor = db.Column(db.String(100), nullable=False)
    room_number = db.Column(db.String(100), nullable=False)
    room_name = db.Column(db.String(100), nullable=False)
    area = db.Column(db.Float, nullable=False)
    room_population = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.String(250))

    # Ventilation properties
    air_per_person = db.Column(db.Float)
    air_person_sum = db.Column(db.Integer)
    air_mission = db.Column(db.Float)
    air_emission_sum = db.Column(db.Float)
    air_process = db.Column(db.Float)
    air_minimum = db.Column(db.Float)
    air_demand = db.Column(db.Float)
    air_supply = db.Column(db.Float)
    air_extract = db.Column(db.Float)
    air_chosen = db.Column(db.Float)
    vent_principle = db.Column(db.String(50))
    heat_exchange = db.Column(db.String(50))
    room_control = db.Column(db.String(50))
    notes = db.Column(db.String(100))
    db_technical = db.Column(db.String(50))
    db_neighbour = db.Column(db.String(50))
    db_corridor = db.Column(db.String(50))

    # Heating properties
    
    outer_wall_area = db.Column(db.Float)
    room_height = db.Column(db.Float)
    window_door_area = db.Column(db.Float)
    inner_wall_area = db.Column(db.Float)
    roof_area = db.Column(db.Float)
    floor_ground_area = db.Column(db.Float)
    floor_air_area = db.Column(db.Float)
    room_volume = db.Column(db.Float)
    heatloss_cold_bridge = db.Column(db.Float)
    heatloss_transmission = db.Column(db.Float)
    heatloss_infiltration = db.Column(db.Float)
    heatloss_ventilation = db.Column(db.Float)
    heatloss_sum = db.Column(db.Float)
    chosen_heating = db.Column(db.Float)
    heat_source = db.Column(db.String(50))
    
    # Cooling properties
    room_temp_summer = db.Column(db.Float)
    internal_heatload_people = db.Column(db.Float)
    internal_heatload_lights = db.Column(db.Float)
    sun_adition = db.Column(db.Float)
    ventair_temp_summer = db.Column(db.Float)
    sum_internal_heatload_people = db.Column(db.Float)
    sum_internal_heatload_lights = db.Column(db.Float)
    internal_heatload_equipment = db.Column(db.Float)
    sun_adition = db.Column(db.Float)
    sun_reduction = db.Column(db.Float)
    sum_internal_heatload = db.Column(db.Float)
    cooling_ventilationair = db.Column(db.Float)
    cooling_equipment = db.Column(db.Float)
    cooling_sum = db.Column(db.Float)


    def get_json_room_data(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "BuildingUid": self.building_uid,
            #"BuildingName": self.building.building_name,
            "RoomTypeId": self.room_type_uid,
            "RoomTypeName": self.room_type.name,
            "Floor": self.floor,
            "RoomNumber": self.room_number,
            "RoomName": self.room_name,
            "Area": self.area,
            "RoomPopulation": self.room_population,
            "Comments": self.comments
        }
    def get_json_ventilation_data(self):
            return {
            "SystemId": self.system_uid,
            "AirPerPerson": self.air_per_person,
            "AirPersonSum": self.air_person_sum,
            "AirEmission": self.air_mission,
            "AirEmissionSum": self.air_emission_sum,
            "AirProcess": self.air_process,
            "AirMinimum": self.air_minimum,
            "AirDemand": self.air_demand,
            "AirSupply": self.air_supply,
            "AirExtract": self.air_extract,
            "AirChosen": self.air_chosen,
            "VentilationPrinciple": self.vent_principle,
            "HeatExchange": self.heat_exchange,
            "RoomControl": self.room_control,
            "Notes": self.notes,
            "DbTechnical": self.db_technical,
            "DbNeighbour": self.db_neighbour,
            "DbCorridor": self.db_corridor
            }
    def get_json_heating_data(self):
        return {
            "OuterWallArea": self.outer_wall_area,
            "RoomHeight": self.room_height,
            "WindowDoorArea": self.window_door_area,
            "InnerWallArea": self.inner_wall_area,
            "RoofArea": self.roof_area,
            "FloorGroundArea": self.floor_ground_area,
            "FloorAirArea": self.floor_air_area,
            "RoomVolume": self.room_volume,
            "HeatLossColdBridge": self.heatloss_cold_bridge,
            "HeatLossTransmission": self.heatloss_transmission,
            "HeatLossInfiltration": self.heatloss_infiltration,
            "HeatLossVentilation": self.heatloss_ventilation,
            "HeatLossSum": self.heatloss_sum,
            "ChosenHeating": self.chosen_heating,
            "HeatSource": self.heat_source
        }
    def get_json_cooling_data(self):
        return {
            "RoomTempSummer": self.room_temp_summer,
            "InternalHeatloadPeople": self.internal_heatload_people,
            "InternalHeatloadLights": self.internal_heatload_lights,
            "SunAdition": self.sun_adition,
            "VentairTempSummer": self.ventair_temp_summer,
            "SumInternalHeatloadPeople": self.sum_internal_heatload_people,
            "SumInternalHeatloadLight": self.sum_internal_heatload_lights,
            "InternalHeatloadEquipment": self.internal_heatload_equipment,
            "SunReduction": self.sun_reduction,
            "SumInternalHeatLoad": self.sum_internal_heatload,
            "CoolingVentilationAir": self.cooling_ventilationair,
            "CoolingEquipment": self.cooling_equipment,
            "CoolingSum": self.cooling_sum
    }

class VentilationSystems(db.Model):
    __tablename__ = "VentilationSystems"
    uid = db.Column(db.String(250), unique=True)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    project_uid = db.Column(db.String(250), db.ForeignKey('Projects.uid'), nullable=False)
    system_name = db.Column(db.String(30), nullable=False)
    location = db.Column(db.String(100))
    service_area = db.Column(db.String(250))
    heat_exchange = db.Column(db.String(30))
    air_flow = db.Column(db.Float)
    air_flow_supply = db.Column(db.Float)
    air_flow_extract = db.Column(db.Float)
    special_system = db.Column(db.String(10))

    room = db.relationship('Rooms', backref="system", lazy=True)

    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "ProjectId": self.project_uid,
            "SystemName": self.system_name,
            "Location": self.location,
            "ServiceArea": self.service_area,
            "HeatExchange": self.heat_exchange,
            "AirFlow": self.air_flow,
            "AirFlowSupply": self.air_flow_supply,
            "AirFlowExtract": self.air_flow_extract,
            "SpecialSystem": self.special_system
        }

''' 
Specification tables
'''
class Specifications(db.Model):
    __tablename__ = "Specifications"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)
    name = db.Column(db.String(50), nullable=False)
    room_types = db.relationship("RoomTypes", backref="specifications", lazy=True)

    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "name": self.name
        }
    
class RoomTypes(db.Model):
    __tablename__ = "RoomTypes"
    uid = db.Column(db.String(250), unique=True)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    specification_uid = db.Column(db.String(250), db.ForeignKey("Specifications.uid"), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    air_per_person = db.Column(db.Float)
    air_emission = db.Column(db.Float)
    air_process = db.Column(db.Float)
    air_minimum = db.Column(db.Float)
    ventilation_principle = db.Column(db.String(50))
    heat_exchange = db.Column(db.String(50))
    room_control = db.Column(db.String(50))
    notes = db.Column(db.String(100))
    db_technical = db.Column(db.String(50))
    db_neighbour = db.Column(db.String(50))
    db_corridor = db.Column(db.String(50))
    comments = db.Column(db.String(20))

    room = db.relationship('Rooms', backref='room_type', lazy=True)

    def get_json(self):
        return {
            "id": self.id,
            "uid": self.uid,
            "specification_uid": self.specification_uid,
            "name": self.name,
            "air_per_person": self.air_per_person,
            "air_emission": self.air_emission,
            "air_process": self.air_process,
            "air_minimum": self.air_minimum,
            "ventilation_principle": self.ventilation_principle,
            "heat_exchange": self.heat_exchange,
            "room_control": self.room_control,
            "notes": self.notes,
            "db_technical": self.db_technical,
            "db_neighbour": self.db_neighbour,
            "db_corridor": self.db_corridor,
            "comments": self.comments
        }
    
class DeletedRooms(db.Model):
    __tablename__ = "DeletedRooms"
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    uid = db.Column(db.String(250), unique=True)

    # Foreign keys
    project_uid = db.Column(db.String(250), db.ForeignKey('Projects.uid'), nullable=False)
    building_uid = db.Column(db.String(250), db.ForeignKey('Buildings.uid'), nullable=False)
    room_type_uid = db.Column(db.String(250), db.ForeignKey('RoomTypes.uid'), nullable=False)
    system_uid = db.Column(db.String(250), db.ForeignKey('VentilationSystems.uid', ondelete="SET NULL"), nullable=True)

    # Basic room data
    floor = db.Column(db.String(100), nullable=False)
    room_number = db.Column(db.String(100), nullable=False)
    room_name = db.Column(db.String(100), nullable=False)
    area = db.Column(db.Float, nullable=False)
    room_population = db.Column(db.Integer, nullable=False)
    comments = db.Column(db.String(250))

    # Ventilation properties
    air_per_person = db.Column(db.Float)
    air_person_sum = db.Column(db.Integer)
    air_mission = db.Column(db.Float)
    air_emission_sum = db.Column(db.Float)
    air_process = db.Column(db.Float)
    air_minimum = db.Column(db.Float)
    air_demand = db.Column(db.Float)
    air_supply = db.Column(db.Float)
    air_extract = db.Column(db.Float)
    air_chosen = db.Column(db.Float)
    vent_principle = db.Column(db.String(50))
    heat_exchange = db.Column(db.String(50))
    room_control = db.Column(db.String(50))
    notes = db.Column(db.String(100))
    db_technical = db.Column(db.String(50))
    db_neighbour = db.Column(db.String(50))
    db_corridor = db.Column(db.String(50))

    # Heating properties
    
    outer_wall_area = db.Column(db.Float)
    room_height = db.Column(db.Float)
    window_door_area = db.Column(db.Float)
    inner_wall_area = db.Column(db.Float)
    roof_area = db.Column(db.Float)
    floor_ground_area = db.Column(db.Float)
    floor_air_area = db.Column(db.Float)
    room_volume = db.Column(db.Float)
    heatloss_cold_bridge = db.Column(db.Float)
    heatloss_transmission = db.Column(db.Float)
    heatloss_infiltration = db.Column(db.Float)
    heatloss_ventilation = db.Column(db.Float)
    heatloss_sum = db.Column(db.Float)
    chosen_heating = db.Column(db.Float)
    heat_source = db.Column(db.String(50))
    
    # Cooling properties
    room_temp_summer = db.Column(db.Float)
    internal_heatload_people = db.Column(db.Float)
    internal_heatload_lights = db.Column(db.Float)
    sun_adition = db.Column(db.Float)
    ventair_temp_summer = db.Column(db.Float)
    sum_internal_heatload_people = db.Column(db.Float)
    sum_internal_heatload_lights = db.Column(db.Float)
    internal_heatload_equipment = db.Column(db.Float)
    sun_adition = db.Column(db.Float)
    sun_reduction = db.Column(db.Float)
    sum_internal_heatload = db.Column(db.Float)
    cooling_ventilationair = db.Column(db.Float)
    cooling_equipment = db.Column(db.Float)
    cooling_sum = db.Column(db.Float)
