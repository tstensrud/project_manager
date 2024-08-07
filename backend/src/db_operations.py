import math
import datetime
from sqlalchemy.inspection import inspect
from sqlalchemy import func, and_
from uuid import uuid4
from . import models, db
from . import globals

'''
Project methods
'''
def new_project(number: str, name: str, description: str) -> models.Projects:
        uid = globals.encode_uid_base64(uuid4())
        new_project = models.Projects(uid=uid,
                                      project_number=number, 
                                        project_name=name, 
                                        project_description=description, 
                                        specification=None)
        try:
            db.session.add(new_project)
            db.session.commit()
            return new_project
        except Exception as e:
            globals.log(f"Error creating new project: {e}")
            db.session.rollback()
            return False

def set_project_specification(project_uid: str, spec_uid: str) -> bool:
    project = get_project(project_uid)
    project.specification = spec_uid
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Error setting project specification {e}")
        db.session.rollback()
        return False

def get_all_projects():
    projects = db.session.query(models.Projects).order_by(models.Projects.project_number).all()
    return projects


def get_project(project_uid: int) -> models.Projects:
    project = db.session.query(models.Projects).filter(models.Projects.uid == project_uid).first()
    return project


def get_all_project_names():
    project_names = []
    projects = models.Projects.query.all()
    for project_name in projects:
        project_names.append(project_name.ProjectName)
    return project_names


def get_all_project_rooms(project_uid: str) -> list:
    rooms = db.session.query(models.Rooms).filter(models.Rooms.project_uid == project_uid).order_by(models.Rooms.floor, models.Rooms.room_number).all()
    return rooms

def count_rooms_in_project(project_uid) -> int:
    total_rooms = db.session.query(func.count(models.Rooms.project_uid)).filter(models.Rooms.project_uid == project_uid).scalar()
    return total_rooms

def check_for_existing_project_number(project_number: str) -> bool:
    project = models.Projects.query.filter_by(project_number = project_number).first()
    if project:
        return True
    else:
        return False

def summarize_project_airflow(project_uid: str) -> float:
    airflow = db.session.query(func.sum(models.Rooms.air_supply)).filter(models.Rooms.project_uid == project_uid).scalar()
    return airflow

'''
TODO-list
'''

def new_todo_item(project_uid: int, author_uid: int, content: str) -> bool:
    date = datetime.datetime.now()
    date = date.strftime("%Y-%m-%d")
    uid = globals.encode_uid_base64(uuid4())
    new_item = models.TodoItem(uid=uid,
                               project_uid=project_uid,
                               author_uid=author_uid,
                               date=date,
                               content=content,
                               date_completed=0,
                               completed_by="")
    try:
        db.session.add(new_item)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new todo item: {e}")
        db.session.rollback()
        return False

def get_todo_item(item_uid: int) -> models.TodoItem:
    item = db.session.query(models.TodoItem).filter(models.TodoItem.uid == item_uid).first()
    return item


def get_project_todo_items(project_uid: int) -> dict:
    todo_list = db.session.query(models.TodoItem).filter(and_(models.TodoItem.project_uid == project_uid, models.TodoItem.completed == False)).order_by(models.TodoItem.date).all()
    todo_dict = [{"id": item.uid, "project_uid": item.project_uid, "author_uid": item.user.name, "date": item.date,
                    "content": item.content, "completed": item.completed, "date_completed": item.date_completed,
                    "completed_by": item.completed_by} for item in todo_list]
    return todo_dict


def set_todo_item_completed(item_uid: int, user_uid: int) -> bool:
    date = datetime.datetime.now()
    date = date.strftime("%Y-%m-%d")
    item = get_todo_item(item_uid)
    item.completed = True
    item.date_completed = date
    item.completed_by = user_uid
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Set todo item complete: {e}")
        db.session.rollback()
        return False

'''
Building methods
'''

def get_building(building_uid: str) -> models.Buildings:
    building = db.session.query(models.Buildings).filter(models.Buildings.uid == building_uid).first()
    return building

def get_building_data(building_uid: str) -> dict:
    building = db.session.query(models.Buildings).filter(models.Buildings.uid == building_uid).first()
    building_data = building.get_json()

    floors = get_building_floors(building_uid)
    floor_summaries = {}
    floor_summaries_heating = {}
    sanitary_summary = summarize_sanitary_equipment_building(building_uid)
    for floor in floors:
        floor_summaries[floor] = {"supply": sum_airflow_supply_floor_building(building_uid, floor),
                                  "extract": sum_airflow_extract_floor_building(building_uid, floor),
                                  "demand": sum_airflow_demand_floor_building(building_uid, floor)}
        floor_summaries_heating[floor] = {"demand": sum_heatloss_demand_building_floor(building_uid, floor),
                                          "chosen": sum_heatloss_chosen_building_floor(building_uid, floor)}

    area = summarize_building_area(building_uid)
    supply_air = summarize_supply_air_building(building_uid)
    extract_air = summarize_extract_air_building(building_uid)
    heating_demand = sum_heat_loss_building(building_uid)
    heating = sum_heat_loss_chosen_building(building_uid)
    demand = summarize_demand_building(building_uid)
    system_uids = systems_in_building(building_uid)
    if None in system_uids:
        system_uids.pop(system_uids.index(None))
    systems = []
    for uid in system_uids:
        system = get_system(uid)
        systems.append(system.system_name)
    systems.sort()

    building_data["area"] = area
    building_data["supplyAir"] = supply_air
    building_data["extractAir"] = extract_air
    building_data["heating"] = heating
    building_data["heatingDemand"] = heating_demand
    building_data["demand"] = demand
    building_data["floors"] = floors
    building_data["floor_summaries"] = floor_summaries
    building_data["floor_summaries_heating"] = floor_summaries_heating
    building_data["systems"] = systems
    building_data["sanitary_summary"] = sanitary_summary

    return building_data

def summarize_sanitary_equipment_building(building_uid: str) -> dict:
    sink_1_14_inch = db.session.query(func.sum(models.Rooms.sink_1_14_inch)).filter(models.Rooms.building_uid == building_uid).scalar()
    sink_large = db.session.query(func.sum(models.Rooms.sink_large)).filter(models.Rooms.building_uid == building_uid).scalar()
    wc = db.session.query(func.sum(models.Rooms.wc)).filter(models.Rooms.building_uid == building_uid).scalar()
    urinal = db.session.query(func.sum(models.Rooms.urinal)).filter(models.Rooms.building_uid == building_uid).scalar()
    dishwasher = db.session.query(func.sum(models.Rooms.dishwasher)).filter(models.Rooms.building_uid == building_uid).scalar()
    shower = db.session.query(func.sum(models.Rooms.shower)).filter(models.Rooms.building_uid == building_uid).scalar()
    tub = db.session.query(func.sum(models.Rooms.tub)).filter(models.Rooms.building_uid == building_uid).scalar()
    washing_machine = db.session.query(func.sum(models.Rooms.washing_machine)).filter(models.Rooms.building_uid == building_uid).scalar()
    tap_water_outlet_inside = db.session.query(func.sum(models.Rooms.tap_water_outlet_inside)).filter(models.Rooms.building_uid == building_uid).scalar()
    tap_water_outlet_outside = db.session.query(func.sum(models.Rooms.tap_water_outlet_outside)).filter(models.Rooms.building_uid == building_uid).scalar()
    firehose = db.session.query(func.sum(models.Rooms.firehose)).filter(models.Rooms.building_uid == building_uid).scalar()
    drain_75_mm = db.session.query(func.sum(models.Rooms.drain_75_mm)).filter(models.Rooms.building_uid == building_uid).scalar()
    drain_110_mm = db.session.query(func.sum(models.Rooms.drain_110_mm)).filter(models.Rooms.building_uid == building_uid).scalar()

    return {
            "sink_1_14_inch": sink_1_14_inch,
            "sink_large": sink_large,
            "wc": wc,
            "urinal": urinal,
            "shower": shower,
            "tub": tub,
            "dishwasher": dishwasher,
            "washing_machine": washing_machine,
            "tap_water_outlet_inside": tap_water_outlet_inside,
            "tap_water_outlet_outside": tap_water_outlet_outside,
            "firehose": firehose,
            "drain_75_mm": drain_75_mm,
            "drain_110_mm": drain_110_mm
    }

def get_building_floors(building_uid: str) -> list[str]:
    floors = db.session.query(models.Rooms.floor).filter(models.Rooms.building_uid == building_uid).distinct().all()
    floors.sort()
    cleaned_floors = [floor[0] for floor in floors]
    return cleaned_floors

def new_building(project_uid: str, building_name: str) -> bool:
    uid = globals.encode_uid_base64(uuid4())
    new_building = models.Buildings(uid=uid,
                                    project_uid=project_uid,
                                    building_name=building_name,
                                    inside_temp = 20.0,
                                    vent_temp = 18.0,
                                    infiltration = 0.15,
                                    u_value_outer_wall = 0.22,
                                    u_value_window_doors = 0.18,
                                    u_value_floor_ground = 0.18,
                                    u_value_floor_air = 0.18,
                                    u_value_roof = 0.18,
                                    cold_bridge_value = 0.06,
                                    year_mid_temp = 5.0,
                                    temp_floor_air = -22,
                                    dut= -22.0,
                                    safety= 10.0)
    try:
        db.session.add(new_building)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new building: {e}")
        db.session.rollback()
        return False
    

def get_all_project_buildings(project_uid: int) -> list[models.Buildings]:
    buildings = models.Buildings.query.filter(models.Buildings.project_uid == project_uid).order_by(models.Buildings.building_name).all()
    if buildings == []:
        return None
    else:
        return buildings

def delete_building(building_uid: str) -> bool:
    rooms = db.session.query(models.Rooms).filter(models.Rooms.building_uid == building_uid).all()
    if rooms is not None:
        return False
    building = get_building(building_uid)
    try:
        db.session.delete(building)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Error deleting building: {e}")
        db.session.rollback()
        return False


'''
Rooms methods
'''

def new_room(project_uid: str, building_uid: str, room_type_uid: str, floor: str, room_number: str, room_name: str, area: float, room_pop: int, 
             air_per_person: float, air_emission: float, air_process: float, air_minimum: float, ventilation_principle: str, 
             heat_exchange: str, room_control: str, notes: str, db_technical: str, db_neighbour: str, db_corridor: str):
    val = 1.0
    uid = globals.encode_uid_base64(uuid4())
    new_room = models.Rooms(
        uid=uid,
        project_uid=project_uid,
        building_uid=building_uid,
        room_type_uid=room_type_uid,
        floor=floor,
        room_number=room_number,
        room_name=room_name,
        area=area,
        room_population=room_pop,
        air_per_person=air_per_person,
        air_mission=air_emission,
        air_process=air_process,
        air_minimum=air_minimum,
        air_supply=0.0,
        air_extract=0.0,
        vent_principle=ventilation_principle,
        heat_exchange=heat_exchange,
        room_control=room_control,
        notes=notes,
        db_technical=db_technical,
        db_neighbour=db_neighbour,
        db_corridor=db_corridor,
        outer_wall_area=val,
        room_height=val,
        window_door_area=val,
        inner_wall_area=val,
        roof_area=val,
        floor_ground_area=val,
        floor_air_area=val,
        room_volume=val,
        heatloss_cold_bridge=val,
        heatloss_transmission=val,
        heatloss_infiltration=val,
        heatloss_ventilation=val,
        heatloss_sum=val,
        chosen_heating=val,
        heat_source="",
        room_temp_summer=26.0,
        internal_heatload_people=100,
        internal_heatload_lights=7.0,
        ventair_temp_summer=18.0,
        sum_internal_heatload_people=val,
        sum_internal_heatload_lights=val,
        internal_heatload_equipment=val,
        sun_adition=val,
        sun_reduction=val,
        sum_internal_heatload=val,
        cooling_ventilationair=val,
        cooling_equipment=val,
        cooling_sum=val,
        shaft="",
        sink_1_14_inch = 0,
        sink_large = 0,
        wc = 0,
        urinal=0,
        dishwasher=0,
        shower=0,
        tub=0,
        washing_machine=0,
        tap_water_outlet_outside=0,
        tap_water_outlet_inside=0,
        firehose=0,
        drain_75_mm=0,
        drain_110_mm=0
    )
    
    
    try:
        db.session.add(new_room)
        db.session.commit()
        return new_room.uid
    except Exception as e:
        globals.log(e)
        db.session.rollback()
        return False
    

def get_room(room_uid: str) -> models.Rooms:
    room = db.session.query(models.Rooms).filter(models.Rooms.uid == room_uid).first()
    return room


def delete_room(room_uid: str) -> bool:   
    room = db.session.query(models.Rooms).filter(models.Rooms.uid == room_uid).first()
    if room:
        room_dict = room.__dict__.copy()
        room_dict.pop('_sa_instance_state')
        deleted_room = models.DeletedRooms(**room_dict)
        try:
            db.session.add(deleted_room)
            db.session.delete(room)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            globals.log(f"delete_room() second try/except block: {e}")
            return False
    else:
        return False

def undo_delete_room(room_uid: str) -> bool:
    room = db.session.query(models.DeletedRooms).filter(models.DeletedRooms.uid == room_uid).first()
    if room:
        room_dict = room.__dict__.copy()
        room_dict.pop('_sa_instance_state')
        undo_room = models.Rooms(**room_dict)
        try:
            db.session.add(undo_room)
            db.session.delete(room)
            db.session.commit()
            return True
        except Exception as e:
            globals.log(f"Failure to undo deletion of room: {e}")
            db.session.rollback()
            return False
    else:
        return False


def check_if_roomnumber_exists(building_uid, room_number) -> bool:
    room = db.session.query(models.Rooms.room_number).join(models.Buildings).filter(and_(models.Buildings.uid == building_uid, models.Rooms.room_number == room_number)).first()
    print(room)
    if room:
        return True
    else:
        return False


def update_room_data(room_uid: int, data) -> bool:
    room = get_room(room_uid)
    processed_data = {}

    for key, value in data.items():
        processed_data[key] = value
    processed_data_list = list(processed_data.keys())

    room_columns = {column.key for column in inspect(models.Rooms).mapper.column_attrs}
    for key in room_columns:
        if key == processed_data_list[0]:
            print(f"Setting {processed_data[key]} into {key} for room {room}")
            setattr(room, key, processed_data[key])
            #break
    try:
        db.session.commit()
        return True
    except Exception as e:
        print("Commit failed")
        db.session.rollback()
        globals.log(f"update_room_data(): {e}")
        return False

'''
Ventilation methods
'''
def initial_ventilation_calculations(room_uid: int) -> bool:
    #print(f"Room ID received: {room_uid}")
    room = get_room(room_uid)
    room.air_person_sum = round((room.room_population * room.air_per_person),1)
    room.air_emission_sum = round((room.area * room.air_mission), 1)
    room.air_demand = round((room.air_person_sum + room.air_emission_sum + room.air_process), 1)
    #print(f"AIR DEMAND: {room.air_demand}")
    room.air_supply = round((math.ceil(room.air_demand / 10) * 10), 1)
    #print(f"AIR SUPPLY: {room.air_supply}")
    room.air_extract = room.air_supply
    if room.area > 0:
        room.air_chosen = round((room.air_supply / room.area), 1)
    else:
        room.air_chosen = 0.0
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"initial_ventilation_calculations: {e}")
        db.session.rollback()
        return False


def update_ventilation_calculations(room_uid: int) -> bool:
    room = get_room(room_uid)
    room.air_person_sum = round((room.room_population * room.air_per_person),1)
    room.air_emission_sum = round((room.area * room.air_mission), 1)
    room.air_demand = round((room.air_person_sum + room.air_emission_sum + room.air_process),1)
    if room.area > 0:
        room.air_chosen = round((room.air_supply / room.area), 1)
    else:
        room.air_chosen = 0.0
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update_ventilation_calculations: {e}")
        db.session.rollback()
        return False


def update_ventilation_table(room_uid: int, new_supply: float, new_extract: float, system=None) -> bool:
    room = get_room(room_uid)
    room = room.room_ventilation
    room.air_supply = new_supply
    room.air_extract = new_extract
    if room.area > 0:
        room.air_chosen = round((new_supply / room.Area), 1)
    else:
        room.air_chosen = 0.0
    if system is not None:
        room.system = system
    try:
        db.session.commit()
        if system is not None:
            update_system_airflows(room.system_uid)
            calculate_total_heat_loss_for_room(room_uid)
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"update_ventilation_table: {e}")
        return False
    


def set_system_for_room(room_uid: int, system_uid: int) -> bool:
    room = get_room(room_uid)
    room.system_uid = system_uid

    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"set_system_for_room_vent_prop: {e}")
        return False


def summarize_building_area(building_uid: int) -> float:
    total_building_area = db.session.query(func.sum(models.Rooms.area)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    return total_building_area


def summarize_project_area(project_uid: int) -> float:
    area = db.session.query(func.sum(models.Rooms.area)).join(models.Buildings).join(models.Projects).filter(models.Projects.uid == project_uid).scalar()
    return area


def summarize_supply_air_building(building_uid: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_supply)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    return supply


def summarize_demand_building(building_uid: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_demand)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    return supply


def summarize_extract_air_building(building_uid: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_extract)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    return supply


def get_ventilation_data_rooms_in_building(building_uid: int):
    data = db.session.query(models.Rooms).join(models.Buildings).filter(models.Buildings.uid == building_uid).order_by(models.Rooms.floor).all()
    return data


def get_ventlation_data_all_rooms_project(project_uid: int):
    data = db.session.query(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.uid == project_uid).order_by(models.Buildings.building_name, models.Rooms.floor).all()
    return data


def get_summary_of_ventilation_system(project_uid: int, system_uid: str) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_extract)).join(models.Buildings).join(models.Projects).filter(and_(models.Projects.uid == project_uid, models.Rooms.system_uid == system_uid)).scalar()
    return supply

'''
Ventilation systems
'''

def new_ventilation_system(project_uid: int, system_number: str, placement: str, service_area: str, heat_ex: str, airflow: float, special: str) -> bool:
    uid = globals.encode_uid_base64(uuid4())
    system = models.VentilationSystems(uid=uid,
                                       project_uid=project_uid, 
                                       system_name=system_number, 
                                       location=placement, 
                                       service_area=service_area, 
                                       heat_exchange=heat_ex, 
                                       air_flow=airflow, 
                                       air_flow_supply=0.0, 
                                       air_flow_extract=0.0,
                                       special_system=special)
    try:
        db.session.add(system)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new_ventilation_system: {e}")
        db.session.rollback()
        return False

def systems_in_building(building_uid) -> list[str]:
    systems = db.session.query(models.Rooms.system_uid).filter(and_(models.Rooms.building_uid == building_uid)).distinct().all()
    return [system[0] for system in systems]

def delete_system(system_uid: int) -> bool:
    rooms = db.session.query(models.Rooms).join(models.VentilationSystems).filter(models.VentilationSystems.uid==system_uid).all()
    db.session.query(models.VentilationSystems).filter(models.VentilationSystems.uid == system_uid).delete()
    
    for room in rooms:
        room.system_uid = None
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"delete system: {e}")
        return False
    

def get_all_systems(project_uid: int) -> list:
    systems = db.session.query(models.VentilationSystems).join(models.Projects).filter(models.Projects.uid == project_uid).order_by(models.VentilationSystems.system_name).all()
    return systems


def get_system(system_uid: int) -> models.VentilationSystems:
    system = db.session.query(models.VentilationSystems).filter(models.VentilationSystems.uid == system_uid).first()
    return system


def check_if_system_number_exists(project_uid: int, system_number: str) -> bool:
    system = db.session.query(models.VentilationSystems).join(models.Projects).filter(models.Projects.uid == project_uid, models.VentilationSystems.system_name == system_number).first()
    if system:
        return True
    else:
        return False
    

def get_system_names(project_uid: int) -> list:
    system_names = db.session.query(models.VentilationSystems.system_name).join(models.Projects).filter(models.Projects.uid == project_uid).all()
    return [system_name[0] for system_name in system_names]


def summarize_system_supply(system_uid) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_supply)).join(models.VentilationSystems).filter(models.VentilationSystems.uid == system_uid).scalar()
    return supply


def summarize_system_extract(system_uid) -> float:
    extract = db.session.query(func.sum(models.Rooms.air_extract)).join(models.VentilationSystems).filter(models.VentilationSystems.uid == system_uid).scalar()
    return extract


def update_system_airflows(system_uid: int) -> bool:
    system = get_system(system_uid)
    if system:
        system.air_flow_supply = summarize_system_supply(system_uid)
        system.air_flow_extract = summarize_system_extract(system_uid)
    else:
        print("no system found")
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update_system_air_flows: {e}")
        db.session.rollback()
        return False


def update_airflow_changed_system(system_uid_new: int, system_uid_old: int) -> bool:
    new_system = get_system(system_uid_new)
    old_system = get_system(system_uid_old)
    new_system.air_flow_supply = summarize_system_supply(system_uid_new)
    new_system.air_flow_extract = summarize_system_extract(system_uid_new)
    old_system.air_flow_supply = summarize_system_supply(system_uid_old)
    old_system.air_flow_extract = summarize_system_extract(system_uid_old)

    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update_airflow_changed_system: {e}")
        db.session.rollback()
        return False


def update_system_info(system_uid: int, data: dict) -> bool:
    print(f"Received data: {data}")
    system = get_system(system_uid)
    processed_data = {}
    for key, value in data.items():
        processed_data[key] = value

    processed_data_list = list(processed_data.keys())

    table_columns = {column.key for column in inspect(models.VentilationSystems).mapper.column_attrs}
    
    for key in table_columns:
        if key == processed_data_list[0]:
            setattr(system, key, processed_data[key])
            break
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"update_system_info: {e}")
        return False

def sum_airflow_demand_floor_building(building_uid: str, floor: str) -> float:
    demand_air = db.session.query(func.sum(models.Rooms.air_demand)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor)).scalar()
    return demand_air if demand_air is not None else 0.0

def sum_airflow_supply_floor_building(building_uid: str, floor: str) -> float:
    supply_air = db.session.query(func.sum(models.Rooms.air_supply)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor)).scalar()
    return supply_air if supply_air is not None else 0.0

def sum_airflow_extract_floor_building(building_uid: str, floor: str) -> float:
    extract_air = db.session.query(func.sum(models.Rooms.air_extract)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor)).scalar()
    return extract_air if extract_air is not None else 0.0

    
'''
Specifications
'''

def new_specifitaion(name: str) -> bool:
    uid = globals.encode_uid_base64(uuid4())
    specification = models.Specifications(uid=uid, name=name)
    try:
        db.session.add(specification)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new specification: {e}")
        db.session.rollback()
        return False

def get_specification(spec_uid: str) -> models.Specifications:
    spec = db.session.query(models.Specifications).filter(models.Specifications.uid == spec_uid).first()
    return spec

def get_specification_by_row(id: str) -> models.Specifications:
    spec = db.session.query(models.Specifications).filter(models.Specifications.id == id).first()
    return spec

def get_specification_by_name(name: str) -> models.Specifications:
    spec = db.session.query(models.Specifications).filter(models.Specifications.name == name).first()
    return spec

# Get list of all specifications in database

def get_specifications() -> list:
    spec_list = []
    specifications = models.Specifications.query.all()
    for spec in specifications:
        spec_list.append(spec)
    return spec_list


def find_specification_name(name: str) -> bool:
    name = db.session.query(models.Specifications.name).filter(models.Specifications.name == name).first()
    if name:
        return True
    else:
        return False
    
# Get data for a specific roomtype in a specification

def get_room_type_data(room_type_uid: int, specification: str):
    room_data_object = db.session.query(models.RoomTypes).join(models.Specifications).filter(and_(models.Specifications.uid == specification, models.RoomTypes.uid == room_type_uid)).first()
    return room_data_object


def get_room_type_name(specification: str, room_uid: int) -> str:
    room_type_name = db.session.query(models.RoomTypes.name).join(models.Specifications).filter(models.Specifications.name == specification, models.RoomTypes.uid == room_uid).first()
    return room_type_name

def find_room_type_for_specification(spec_uid: str, room_type_name: str) -> bool:
    room_type = db.session.query(models.RoomTypes.name).filter(and_(models.RoomTypes.specification_uid == spec_uid, models.RoomTypes.name == room_type_name)).first()
    if room_type:
        return True
    else:
        return False

# Get name of all room types for a specific specification
#
def get_specification_room_types(specification_uid: str):
    room_types = db.session.query(models.RoomTypes).join(models.Specifications).filter(models.Specifications.uid == specification_uid).all()
    #print(f"Found room types: {room_types} for specid {specification_uid}")
    return room_types

# Get all room types and data for a specific specification

def get_specification_room_data(specification_uid: str):
    data = db.session.query(models.RoomTypes).join(models.Specifications).filter(models.Specifications.uid == specification_uid).all()
    return data


def new_specification_room_type(specification_uid: int, data) -> bool:
    room_control = ""
    if data["vav"] == "1":
        room_control = room_control + "VAV, "
    else:
        room_control = room_control + "CAV, "
    if data["co2"] == "True":
        room_control = room_control + "CO2, "
    if data["temp"] == "True":
        room_control = room_control + "T, "
    if data["movement"] == "True":
        room_control = room_control + "B, "
    if data["moisture"] == "True":
        room_control = room_control + "F, "
    if data["time"] == "True":
        room_control = room_control + "Tid"
    uid = globals.encode_uid_base64(uuid4())
    room = models.RoomTypes(uid=uid,
                            specification_uid=specification_uid,
                            name=data["room_type"],
                            air_per_person=data["air_per_person"],
                            air_emission=data["air_emission"],
                            air_process=data["air_process"],
                            air_minimum=data["air_minimum"],
                            ventilation_principle=data["ventilation_principle"],
                            heat_exchange=data["heat_ex"],
                            room_control=room_control,
                            notes=data["notes"],
                            db_technical=data["db_technical"],
                            db_neighbour=data["db_neighbour"],
                            db_corridor=data["db_corridor"],
                            comments="")
    try:
        db.session.add(room)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"create new room type {e}")
        db.session.rollback()
        return False


'''
Heating and cooling
'''

def update_building_heating_settings(building_uid: str, updated_data) -> bool:
    building = db.session.query(models.Buildings).filter(models.Buildings.uid == building_uid).first()


    processed_data = {}

    for key, value in updated_data.items():
        processed_data[key] = value

    processed_data_list = list(processed_data.keys())

    building_columns = {column.key for column in inspect(models.Buildings).mapper.column_attrs}
    for key in building_columns:
        if key == processed_data_list[0]:
            setattr(building, key, processed_data[key])
            break
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update building settings: {e}")
        db.session.rollback()
        return False


def infiltration_loss(delta_t_inside_outside: float, room_volume: float, air_change_per_hour: float) -> float:
    infiltration_loss = 0.28 * 1.2 * delta_t_inside_outside * room_volume * air_change_per_hour
    return infiltration_loss


def ventilation_loss(air_flow_per_area: float, room_area: float, indoor_temp: float, vent_air_temp: float) -> float:
    ventilation_loss = 0.35 * air_flow_per_area * room_area * (indoor_temp - vent_air_temp)
    return ventilation_loss


def calculate_total_heat_loss_for_room(room_uid: int) -> bool:
    try:
        room = get_room(room_uid)
        building = get_building(room.building_uid)
        if not room:
            ##print(f"No room found for heating_room_uid: {heating_room_uid}")
            return False
        if not building:
            ##print(f"No building settings found for room with heating_room_uid: {heating_room_uid}")
            return False
        
        dt_surfaces_to_air = building.inside_temp - building.dut
        dt_floor_ground = building.inside_temp - building.year_mid_temp
        outer_wall_area = room.outer_wall_area - room.window_door_area
        ##print(f"dt_surfaces_to_air: {dt_surfaces_to_air}, dt_floor_ground: {dt_floor_ground}, outer_wall_area: {outer_wall_area}")
        
        transmission_loss_outer_walls = building.u_value_outer_wall * dt_surfaces_to_air * outer_wall_area
        transmission_loss_windows_doors = building.u_value_window_doors * dt_surfaces_to_air * room.window_door_area
        if room.floor_ground_area != 0:
            transmission_loss_floor = building.u_value_floor_ground * dt_floor_ground * room.floor_ground_area
        else:
            transmission_loss_floor = building.u_value_floor_air * dt_floor_ground * room.floor_air_area
        transmission_loss_roof = building.u_value_roof * dt_surfaces_to_air * room.roof_area
        ##print(f"Transmission losses calculated: outer_walls={transmission_loss_outer_walls}, windows_doors={transmission_loss_windows_doors}, floor={transmission_loss_floor}, roof={transmission_loss_roof}")
        room_cold_bridge_loss = building.cold_bridge_value * room.area * dt_surfaces_to_air
        room_ventilation_loss = ventilation_loss((room.air_supply / room.area), room.area, building.inside_temp, building.vent_temp)
        room_infiltration_loss = infiltration_loss(dt_surfaces_to_air, (room.area * room.room_height), building.infiltration)
        ##print(f"Cold bridge loss: {room_cold_bridge_loss}, ventilation loss: {room_ventilation_loss}, infiltration loss: {room_infiltration_loss}")
        safety = 1 + ((building.safety) / 100)
        ##print(f"Safety: {building.Safety}")
        total_transmission_loss = transmission_loss_outer_walls + transmission_loss_windows_doors + transmission_loss_floor + transmission_loss_roof
        
        total_heat_loss = safety * (total_transmission_loss + room_cold_bridge_loss + room_infiltration_loss + room_ventilation_loss)
        
        room.heatloss_ventilation = room_ventilation_loss
        room.heatloss_infiltration = room_infiltration_loss
        room.heatloss_cold_bridge = room_cold_bridge_loss
        room.heatloss_transmission = total_transmission_loss
        room.heatloss_sum = round(total_heat_loss,1)
        room.chosen_heating = round((math.ceil(room.heatloss_sum / 100) * 100), 1)

        ##print(f"Total heat loss for room {heating_room_uid}: {total_heat_loss}")
    
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"calcualte total heat loss: {e}")
        db.session.rollback()
        return False


def get_all_rooms_building(building_uid: int) -> list[models.Rooms]:
    rooms = db.session.query(models.Rooms).join(models.Buildings).filter(models.Buildings.uid == building_uid).all()
    if not rooms:
        print(f"No rooms found for building_uid: {building_uid}")
    else:
        print(f"Found {len(rooms)} rooms for building_uid: {building_uid}")
    return rooms

def sum_heatloss_demand_building_floor(building_uid: str, floor: str) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.heatloss_sum)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor)).scalar()
    return heat_loss

def sum_heatloss_chosen_building_floor(building_uid: str, floor: str) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.chosen_heating)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor)).scalar()
    return heat_loss



def sum_heat_loss_building(building_uid: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.heatloss_sum)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    return heat_loss


def sum_heat_loss_chosen_building(building_uid: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.chosen_heating)).join(models.Buildings).filter(models.Buildings.uid == building_uid).scalar()
    #print("WE CALCULATED HEATLOSS")
    return heat_loss


def sum_heat_loss_project(project_uid: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.heatloss_sum)).join(models.Projects).filter(models.Rooms.project_uid == project_uid).scalar()
    print(heat_loss)
    return heat_loss


def sum_heat_loss_project_chosen(project_uid: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.chosen_heating)).join(models.Buildings).join(models.Projects).filter(models.Projects.uid == project_uid).scalar()
    return heat_loss

'''
Cooling
'''

def set_standard_cooling_settings(room_uid: int, data) -> bool:
    room = get_room(room_uid)
    room.room_temp_summer = data["room_temp_summer"] if data["room_temp_summer"] != 0 else room.room_temp_summer
    room.internal_heatload_people = data["internal_heatload_people"] if data["internal_heatload_people"] != 0 else room.internal_heatload_people
    room.internal_heatload_lights = data["internal_heatload_lights"] if data["internal_heatload_lights"] != 0 else room.internal_heatload_lights
    room.ventair_temp_summer = data["vent_temp_summer"] if data["vent_temp_summer"] != 0 else room.ventair_temp_summer
    room.sun_adition = data["sun_adition"] if data["sun_adition"] != 0 else room.sun_adition
    room.sun_reduction = data["sun_reduction"] if data["sun_reduction"] != 0 else room.sun_reduction

    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Set standard cooling settings: {e}")
        db.session.rollback()
        return False


def calculate_heat_loads_for_room(room_uid: int) -> bool:
    room = get_room(room_uid)
    room.sum_internal_heatload_lights = room.internal_heatload_lights * room.area
    room.sum_internal_heatload_people = room.internal_heatload_people * room.room_population
    room.sum_internal_heatload = (room.sun_adition * room.sun_reduction) + room.internal_heatload_equipment
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Calculate heat lods for room: {e}")
        return False



def calculate_total_cooling_for_room(room_uid: int) -> bool:
    if calculate_heat_loads_for_room(room_uid):
        room = get_room(room_uid)   
        
        heatload_sun = room.sun_adition * room.sun_reduction
        sum_internal_heat_loads = room.sum_internal_heatload_people + room.sum_internal_heatload_lights + room.internal_heatload_equipment + heatload_sun
        
        cooling_from_vent = 0.35 * room.air_supply * (room.room_temp_summer - room.ventair_temp_summer)
        sum_cooling = cooling_from_vent + room.cooling_equipment

        room.cooling_ventilationair = round(cooling_from_vent, 1)
        room.sum_internal_heatload = round(sum_internal_heat_loads, 1)
        room.cooling_sum = round(sum_cooling,1)
        try:
            db.session.commit()
            return True
        except Exception as e:
            globals.log(f"cooling calculatiosn: {e}")
            db.session.rollback()
            return False
    else:
        return False



'''

Varme
dT: innetemp - utetemp
Kuldebro: Normalisert kuldebroverdi * gulvarea * ytterveggareal * dT
Transmisjon, for hver ytter, inner, gulv, tak og vindu/dør: U-verdi*dT*areal
Inflitrasjon: dT(inne ute) * romvolum * luftveksling/time
ventilasjon: 0,35*(luftmengde/areal)*romareal*(innetemp-innblåsttemp)

'''


'''
Kjøling
Varmetilskudd sol: soltilskudd(W/m2K) * solreduksjon (0-1,0)
Sum varme: personer + lys + sol + ekstrautstyr

kjøletilskudd luft: tilluft*0,35*(temp rom - temp luft)
sum kjøling: kjøletilskudd luft + lokal kjøling

ekstra luftmengde for å klare kjøling:
hvis sum internlast > sum kjøletilskudd

(varme-kjøling)/(0,35*(temp inn - temp ute))
'''