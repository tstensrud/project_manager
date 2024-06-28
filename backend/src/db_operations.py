import math
import datetime

from sqlalchemy import func, and_
from . import models, db
from . import globals

'''
Project methods
'''

def get_all_projects():
    projects = db.session.query(models.Projects).order_by(models.Projects.project_number).all()
    return projects


def get_project(project_id: int) -> models.Projects:
    project = db.session.query(models.Projects).filter(models.Projects.id == project_id).first()
    return project


def get_all_project_names():
    project_names = []
    projects = models.Projects.query.all()
    for project_name in projects:
        project_names.append(project_name.ProjectName)
    return project_names


def get_all_project_rooms(project_id):
    rooms = db.session.query(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).order_by(models.Buildings.building_name, models.Rooms.floor, models.Rooms.room_number).all()
    return rooms


def get_all_project_buildings(project_id: int):
    buildings = db.session.query(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).all()
    return buildings


def check_for_existing_project_number(project_number: str) -> bool:
    project = models.Projects.query.filter_by(project_number = project_number).first()
    if project:
        return True
    else:
        return False

'''
TODO-list
'''

def new_todo_item(project_id: int, author_id: int, content: str) -> bool:
    date = datetime.datetime.now()
    date = date.strftime("%Y-%m-%d")

    new_item = models.TodoItem(project_id=project_id,
                               author_id=author_id,
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

def get_todo_item(item_id: int) -> models.TodoItem:
    item = db.session.query(models.TodoItem).filter(models.TodoItem.id == item_id).first()
    return item


def get_project_todo_items(project_id: int) -> dict:
    todo_list = db.session.query(models.TodoItem).filter(and_(models.TodoItem.project_id == project_id, models.TodoItem.completed == False)).order_by(models.TodoItem.date).all()
    todo_dict = [{"id": item.id, "project_id": item.project_id, "author_id": item.user.name, "date": item.date,
                    "content": item.content, "completed": item.completed, "date_completed": item.date_completed,
                    "completed_by": item.completed_by} for item in todo_list]
    return todo_dict


def set_todo_item_completed(item_id: int, user_id: int) -> bool:
    date = datetime.datetime.now()
    date = date.strftime("%Y-%m-%d")
    item = get_todo_item(item_id)
    item.completed = True
    item.date_completed = date
    item.completed_by = user_id
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

def get_building(building_id: int) -> models.Buildings:
    building = db.session.query(models.Buildings).filter(models.Buildings.id == building_id).first()
    return building

def get_building_data(building_id: int) -> dict:
    building = db.session.query(models.Buildings).filter(models.Buildings.id == building_id).first()
    building_data = building.get_json()
    area = summarize_building_area(building_id)
    supply_air = summarize_supply_air_building(building_id)
    extract_air = summarize_extract_air_building(building_id)
    heating = sum_heat_loss_chosen_building(building_id)
    print (f"HEATING IS {type(heating)}")
    building_data["area"] = area
    building_data["supplyAir"] = supply_air
    building_data["extractAir"] = extract_air
    building_data["heating"] = heating
    return building_data


def new_building(project_id: int, building_name: str) -> bool:
    new_building = models.Buildings(project_id = project_id, building_name = building_name)
    try:
        db.session.add(new_building)
        db.session.commit()
        set_up_energy_settings_building(project_id, new_building.id)
        return True
    except Exception as e:
        globals.log(f"new building: {e}")
        db.session.rollback()
        return False
    

def get_all_project_buildings(project_id: int):
    buildings = models.Buildings.query.filter_by(project_id = project_id).all()
    if buildings == []:
        return None
    else:
        return buildings


def get_building_id(project_id: int, building_name: str) -> int:
    building = db.session.query(models.Buildings).join(models.Projects).filter(and_(models.Projects.id == project_id, models.Buildings.building_name == building_name)).first()
    return building.id

'''
Rooms methods
'''

def new_room(building_id: int, room_type_id: int, floor: str, room_number: str, room_name: str, area: float, room_pop: int, 
             air_per_person: float, air_emission: float, air_process: float, air_minimum: float, ventilation_principle: str, 
             heat_exchange: str, room_control: str, notes: str, db_technical: str, db_neighbour: str, db_corridor: str):
    building_energy_settings = get_building_energy_settings(building_id)
    print(f"BUILDNIG ENERGY SETTINGS: {building_energy_settings} with ID")
    val = 1.0
    
    new_room = models.Rooms(
        building_id=building_id,
        room_type_id=room_type_id,
        building_energy_settings=building_energy_settings.id,
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
        cooling_sum=val
    )
    
    
    try:
        db.session.add(new_room)
        db.session.commit()
        return new_room.id
    except Exception as e:
        globals.log(e)
        db.session.rollback()
        return False
    

def get_room(room_id: int) -> models.Rooms:
    room = db.session.query(models.Rooms).filter(models.Rooms.id == room_id).first()
    return room


def get_room_id(project_id: int, building_id: int, room_number: str) -> int:
    room = db.session.query(models.Rooms).join(models.Buildings).join(models.Projects).filter(and_(models.Projects.id == project_id, models.Buildings.id == building_id, models.Rooms.room_number == room_number)).first()
    return room.id


def delete_room(room_id: int) -> bool:   
    room = db.session.query(models.Rooms).filter(models.Rooms.id == room_id).first()
    if room:
        try:
            db.session.delete(room)
            db.session.commit()
            return True
        except Exception as e:
            db.session.rollback()
            globals.log(f"delete_room() second try/except block: {e}")
            return False
    else:
        return False


def check_if_roomnumber_exists(project_id, building_id, room_number) -> bool:
    room = db.session.query(models.Rooms).join(models.Buildings).join(models.Projects).filter(and_(models.Projects.id == project_id, models.Buildings.id == building_id, models.Rooms.room_number == room_number)).first()
    if room:
        return True
    else:
        return False


def update_room_data(room_id: int, new_data) -> bool:
    room = get_room(room_id)
    room.area = new_data["area"]
    room.room_population = new_data["population"]
    room.room_number = new_data["room_number"]
    room.room_name = new_data["room_name"]
    room.comments = new_data["comments"]
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"update_room_data(): {e}")
        return False

'''
Ventilation methods
'''
def initial_ventilation_calculations(room_id: int) -> bool:
    print("DID WE GET HERE??")
    room = get_room(room_id)
    print(room)
    room.air_person_sum = round((room.room_population * room.air_per_person),1)
    room.air_emission_sum = round((room.area * room.air_mission), 1)
    room.air_demand = round((room.air_person_sum + room.air_emission_sum + room.air_process), 1)
    print(f"AIR DEMAND: {room.air_demand}")
    room.air_supply = round((math.ceil(room.air_demand / 10) * 10), 1)
    print(f"AIR SUPPLY: {room.air_supply}")
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


def update_ventilation_calculations(room_id: int) -> bool:
    room = get_room(room_id)
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


def update_ventilation_table(room_id: int, new_supply: float, new_extract: float, system=None) -> bool:
    print(f"System id for update ventilation table: {system}")
    room = get_room(room_id)
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
            update_system_airflows(room.system_id)
            calculate_total_heat_loss_for_room(room_id)
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"update_ventilation_table: {e}")
        return False
    


def set_system_for_room(room_id: int, system_id: int) -> bool:
    room = get_room(room_id)
    room.system_id = system_id

    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"set_system_for_room_vent_prop: {e}")
        return False


def summarize_building_area(building_id: int) -> float:
    total_building_area = db.session.query(func.sum(models.Rooms.area)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return total_building_area


def summarize_project_area(project_id: int) -> float:
    area = db.session.query(func.sum(models.Rooms.area)).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return area


def summarize_supply_air_building(building_id: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_supply)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return supply


def summarize_demand_building(building_id: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_demand)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return supply


def summarize_extract_air_building(building_id: int) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_extract)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return supply


def get_ventilation_data_rooms_in_building(building_id: int):
    data = db.session.query(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).order_by(models.Rooms.floor).all()
    return data


def get_ventlation_data_all_rooms_project(project_id: int):
    data = db.session.query(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).order_by(models.Buildings.building_name, models.Rooms.floor).all()
    return data


def get_summary_of_ventilation_system(project_id: int, system_id: str) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_extract)).join(models.Buildings).join(models.Projects).filter(and_(models.Projects.id == project_id, models.Rooms.system_id == system_id)).scalar()
    return supply

'''
Ventilation systems
'''

def new_ventilation_system(project_id: int, system_number: str, placement: str, service_area: str, heat_ex: str, airflow: float, special: str) -> bool:
    system = models.VentilationSystems(project_id=project_id, 
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


def delete_system(system_id: int) -> bool:
    rooms = db.session.query(models.Rooms).join(models.VentilationSystems).filter(models.VentilationSystems.id==system_id).all()
    db.session.query(models.VentilationSystems).filter(models.VentilationSystems.id == system_id).delete()
    
    print(rooms)
    for room in rooms:
        room.system_id = None
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"delete system: {e}")
        return False
    

def get_all_systems(project_id: int) -> list:
    systems = db.session.query(models.VentilationSystems).join(models.Projects).filter(models.Projects.id == project_id).order_by(models.VentilationSystems.system_name).all()
    return systems


def get_system(system_id: int) -> models.VentilationSystems:
    system = db.session.query(models.VentilationSystems).filter(models.VentilationSystems.id == system_id).first()
    return system


def check_if_system_number_exists(project_id: int, system_number: str) -> bool:
    system = db.session.query(models.VentilationSystems).join(models.Projects).filter(models.Projects.id == project_id, models.VentilationSystems.system_name == system_number).first()
    if system:
        return True
    else:
        return False
    

def get_system_names(project_id: int) -> list:
    system_names = db.session.query(models.VentilationSystems.system_name).join(models.Projects).filter(models.Projects.id == project_id).all()
    return [system_name[0] for system_name in system_names]


def summarize_system_supply(system_id) -> float:
    supply = db.session.query(func.sum(models.Rooms.air_supply)).join(models.VentilationSystems).filter(models.VentilationSystems.id == system_id).scalar()
    return supply


def summarize_system_extract(system_id) -> float:
    extract = db.session.query(func.sum(models.Rooms.air_extract)).join(models.VentilationSystems).filter(models.VentilationSystems.id == system_id).scalar()
    return extract


def update_system_airflows(system_id: int) -> bool:
    system = get_system(system_id)
    if system:
        system.air_flow_supply = summarize_system_supply(system_id)
        system.air_flow_extract = summarize_system_extract(system_id)
    else:
        print("no system found")
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update_system_air_flows: {e}")
        db.session.rollback()
        return False


def update_airflow_changed_system(system_id_new: int, system_id_old: int) -> bool:
    new_system = get_system(system_id_new)
    old_system = get_system(system_id_old)
    new_system.air_flow_supply = summarize_system_supply(system_id_new)
    new_system.air_flow_extract = summarize_system_extract(system_id_new)
    old_system.air_flow_supply = summarize_system_supply(system_id_old)
    old_system.air_flow_extract = summarize_system_extract(system_id_old)

    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update_airflow_changed_system: {e}")
        db.session.rollback()
        return False


def update_system_info(system_id: int, system_number: str, system_location: str, service_area: str, airflow: float, heat_ex: str) -> bool:
    system = get_system(system_id)
    system.system_name = system_number
    system.location = system_location
    system.service_area = service_area
    system.air_flow = airflow
    system.heat_exchange = heat_ex
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"update_system_info: {e}")
        return False


'''
Specifications
'''

def new_specifitaion(name: str) -> bool:
    specification = models.Specifications(name=name)
    try:
        db.session.add(specification)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new specification: {e}")
        db.session.rollback()
        return False


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

def get_room_type_data(room_type_id: int, specification: int):
    room_data_object = db.session.query(models.RoomTypes).join(models.Specifications).filter(and_(models.Specifications.id == specification, models.RoomTypes.id == room_type_id)).first()
    return room_data_object


def get_room_type_name(specification: str, room_id: int) -> str:
    room_type_name = db.session.query(models.RoomTypes.name).join(models.Specifications).filter(models.Specifications.name == specification, models.RoomTypes.id == room_id).first()
    return room_type_name

# Get name of all room types for a specific specification
#
def get_specification_room_types(specification_id: int):
    room_types = db.session.query(models.RoomTypes).join(models.Specifications).filter(models.Specifications.id == specification_id).all()
    return room_types

# Get all room types and data for a specific specification

def get_specification_room_data(specification_name: str):
    data = db.session.query(models.RoomTypes).join(models.Specifications).filter(models.Specifications.name == specification_name).all()
    return data


def new_specification_room_type(specification_id: int, data) -> bool:
    room_control = ""
    if data["control_vav"] == "1":
        room_control = room_control + "VAV, "
    else:
        room_control = room_control + "CAV, "
    if data["control_co2"] == "True":
        room_control = room_control + "CO2, "
    if data["control_temp"] == "True":
        room_control = room_control + "T, "
    if data["control_movement"] == "True":
        room_control = room_control + "B, "
    if data["control_moisture"] == "True":
        room_control = room_control + "F, "
    if data["control_time"] == "True":
        room_control = room_control + "Tid"

    room = models.RoomTypes(specification_id=specification_id,
                            name=data["room_type"],
                            air_per_person=data["air_p_p"],
                            air_emission=data["air_emission"],
                            air_process=data["air_process"],
                            air_minimum=data["air_minimum"],
                            ventilation_principle=data["vent_princ"],
                            heat_exchange=data["heat_ex"],
                            room_control=room_control,
                            notes=data["notes"],
                            db_technical=data["db_t"],
                            db_neighbour=data["db_n"],
                            db_corridor=data["db_c"],
                            comments="")
    try:
        db.session.add(room)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"create new room type {e}")
        db.session.rollback()
        return False
    
def set_up_energy_settings_building(project_id: int, building_id: int) -> bool:
    building_settings = models.BuildingEnergySettings(project_id = project_id,
                                                      building_id = building_id,
                                                      inside_temp = 20.0,
                                                      vent_temp = 18.0,
                                                      infiltration = 0.15,
                                                      u_value_outer_wall = 0.22,
                                                      u_value_window_doors = 0.18,
                                                      u_value_floor_ground = 0.18,
                                                      u_value_floor_air = 0.18,
                                                      u_value_roof = .018,
                                                      cold_bridge_value = 0.06,
                                                      year_mid_temp = 5.0,
                                                      temp_floor_air = -22,
                                                      dut= -22.0,
                                                      safety= 10.0)
    try:
        db.session.add(building_settings)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"set up heating settings building: {e}")
        db.session.rollback()
        return False


def update_building_heating_settings(updated_data) -> bool:
    building_heat_settings_id = updated_data["id"]
    building_settings = db.session.query(models.BuildingEnergySettings).filter(models.BuildingEnergySettings.id == building_heat_settings_id).first()
    building_settings.inside_temp = updated_data["inside_temp"]
    building_settings.dut = updated_data["dut"]
    building_settings.vent_temp = updated_data["vent_temp"]
    building_settings.infiltration = updated_data["infiltration"]
    building_settings.u_value_outer_wall = updated_data["u_outer"]
    building_settings.u_value_window_doors = updated_data["u_window_door"]
    building_settings.u_value_floor_ground = updated_data["u_floor_ground"]
    building_settings.u_value_floor_air = updated_data["u_floor_air"]
    building_settings.u_value_roof = updated_data["u_roof"]
    building_settings.cold_bridge_value = updated_data["cold_bridge"]
    building_settings.year_mid_temp = updated_data["year_mid_temp"]
    building_settings.temp_floor_air = updated_data["temp_floor_air"]
    building_settings.safety = updated_data["safety"]
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update building settings: {e}")
        db.session.rollback()
        return False


def update_room_heating_data(room_id: int, data) -> bool:
    room = get_room(room_id)
    room.outer_wall_area = data["outer_wall_area"]
    room.room_height = data["room_height"]
    room.inner_wall_area = data["inner_wall_area"]
    room.window_door_area = data["window_door_area"]
    room.roof_area = data["roof_area"]
    room.floor_ground_area = data["floor_ground_area"]
    room.floor_air_area = data["floor_air_area"]
    room.heat_source = data["heat_source"]
    room.chosen_heating = data["chosen_heating"]
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update room heating data: {e}")
        db.session.rollback()
        return False


def infiltration_loss(delta_t_inside_outside: float, room_volume: float, air_change_per_hour: float) -> float:
    infiltration_loss = 0.28 * 1.2 * delta_t_inside_outside * room_volume * air_change_per_hour
    return infiltration_loss


def ventilation_loss(air_flow_per_area: float, room_area: float, indoor_temp: float, vent_air_temp: float) -> float:
    ventilation_loss = 0.35 * air_flow_per_area * room_area * (indoor_temp - vent_air_temp)
    return ventilation_loss


def calculate_total_heat_loss_for_room(room_id: int) -> bool:
    try:
        room = get_room(room_id)
        if not room:
            #print(f"No room found for heating_room_id: {heating_room_id}")
            return False

        building = room.building_energy_settings
        if not building:
            #print(f"No building settings found for room with heating_room_id: {heating_room_id}")
            return False
        dt_surfaces_to_air = building.inside_temp - building.dut
        dt_floor_ground = building.inside_temp - building.year_mid_temp
        outer_wall_area = room.outer_wall_area - room.window_door_area
        #print(f"dt_surfaces_to_air: {dt_surfaces_to_air}, dt_floor_ground: {dt_floor_ground}, outer_wall_area: {outer_wall_area}")
        
        transmission_loss_outer_walls = building.u_value_outer_wall * dt_surfaces_to_air * outer_wall_area
        transmission_loss_windows_doors = building.u_value_window_doors * dt_surfaces_to_air * room.window_door_area
        if room.floor_ground_area != 0:
            transmission_loss_floor = building.u_value_floor_ground * dt_floor_ground * room.floor_ground_area
        else:
            transmission_loss_floor = building.u_value_floor_air * dt_floor_ground * room.floor_air_area
        transmission_loss_roof = building.u_value_roof * dt_surfaces_to_air * room.roof_area
        #print(f"Transmission losses calculated: outer_walls={transmission_loss_outer_walls}, windows_doors={transmission_loss_windows_doors}, floor={transmission_loss_floor}, roof={transmission_loss_roof}")
        room_cold_bridge_loss = building.cold_bridge_value * room.area * dt_surfaces_to_air
        room_ventilation_loss = ventilation_loss((room.air_supply / room.area), room.area, building.inside_temp, building.vent_temp)
        room_infiltration_loss = infiltration_loss(dt_surfaces_to_air, (room.area * room.room_height), building.infiltration)
        #print(f"Cold bridge loss: {room_cold_bridge_loss}, ventilation loss: {room_ventilation_loss}, infiltration loss: {room_infiltration_loss}")
        safety = 1 + ((building.safety) / 100)
        #print(f"Safety: {building.Safety}")
        
        total_heat_loss = safety * (transmission_loss_outer_walls+
                                                    transmission_loss_windows_doors+
                                                    transmission_loss_floor+
                                                    transmission_loss_roof+
                                                    room_cold_bridge_loss+
                                                    room_infiltration_loss+
                                                    room_ventilation_loss)
        room.heatloss_sum = round(total_heat_loss,1)
        #print(f"Total heat loss for room {heating_room_id}: {total_heat_loss}")
    
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"calcualte total heat loss: {e}")
        db.session.rollback()
        return False


def get_all_rooms_energy_building(building_id: int) -> list:
    rooms = db.session.query(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).all()
    if not rooms:
        print(f"No rooms found for building_id: {building_id}")
    else:
        print(f"Found {len(rooms)} rooms for building_id: {building_id}")
    return rooms


def get_energy_settings_all_buildings(project_id: int):
    heating_settings = db.session.query(models.BuildingEnergySettings).join(models.Projects).filter(models.BuildingEnergySettings.project_id == project_id).all()
    return heating_settings


def get_building_energy_settings(building_id: int) -> models.BuildingEnergySettings:
    settings = db.session.query(models.BuildingEnergySettings).join(models.Buildings).filter(models.Buildings.id == building_id).first()
    print(f"BUILDING ENERGY SETTINGS FETCHED {settings}")
    return settings


def sum_heat_loss_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.heatloss_sum)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return heat_loss


def sum_heat_loss_chosen_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.chosen_heating)).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    print("WE CALCULATED HEATLOSS")
    return heat_loss


def sum_heat_loss_project(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.heatloss_sum)).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss


def sum_heat_loss_project_chosen(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.Rooms.chosen_heating)).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss

'''
Cooling
'''


def update_internal_heat_loads(room_id: int) -> bool:
    room = get_room(room_id)



def set_standard_cooling_settings(room_id: int, data) -> bool:
    room = get_room(room_id)
    room.room_temp_summer = data["room_temp_summer"] if data["room_temp_summer"] != 0 else room.room_temp_summer
    room.internal_heatload_people = data["internal_load_people"] if data["internal_load_people"] != 0 else room.internal_heatload_people
    room.internal_heatload_lights = data["internal_load_light"] if data["internal_load_light"] != 0 else room.internal_heatload_lights
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


def calculate_heat_loads_for_room(room_id: int) -> bool:
    room = get_room(room_id)
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



def calculate_total_cooling_for_room(room_id: int) -> bool:
    if calculate_heat_loads_for_room(room_id):
        room = get_room(room_id)   
        
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


def update_room_data_cooling(room_id: int, data) -> bool:
    print(data)
    room = get_room(room_id)
    room.room_temp_summer = data["room_temp_summer"]
    room.internal_heatload_people = data["internal_load_people"]
    room.internal_heatload_lights = data["internal_load_light"]
    room.internal_heatload_equipment = data["internal_load_equipment"]
    room.sun_adition = data["sun_adition"]
    room.sun_reduction = data["sun_reduction"]
    room.cooling_equipment = data["equipment_cooling"]
    try:
        db.session.commit()
    except Exception as e:
        globals.log(f"Update room data cooling: {e}")
        db.session.rollback()
        return False
    if calculate_total_cooling_for_room(room_id):
        return True
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