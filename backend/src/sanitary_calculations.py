
from . import models, db
from sqlalchemy import func, and_
import math

def get_sanitary_equipment_values(equipment: str) -> models.SanitaryEquipmentWaterData:
    item = db.session.query(models.SanitaryEquipmentWaterData).filter(models.SanitaryEquipmentWaterData.equipment_type == equipment).first()
    if item:
        return item
    else:
        return None

def sum_drainage_building(building_uid: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_drainage = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(models.Rooms.building_uid == building_uid).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_drainage = total_drainage + (sum * sanitary_values.water_flow_drainage)
    return total_drainage

def sum_cold_water_building(building_uid: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_cold_water = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(models.Rooms.building_uid == building_uid).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_cold_water = total_cold_water + (sum * sanitary_values.water_flow_cold_water)
    return total_cold_water

def sum_hot_water_building(building_uid: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_hot_water = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(models.Rooms.building_uid == building_uid).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_hot_water = total_hot_water + (sum * sanitary_values.water_flow_warm_water)
    return total_hot_water

def sum_drainage_floor(building_uid: str, floor: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_drainage = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor, models.Rooms.shaft == shaft)).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_drainage = total_drainage + (sum * sanitary_values.water_flow_drainage)
    return total_drainage

def sum_cold_water_floor(building_uid: str, floor: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_cold_water = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor, models.Rooms.shaft == shaft)).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_cold_water = total_cold_water + (sum * sanitary_values.water_flow_cold_water)
    #print(f"Total cold water: {total_cold_water}")
    return total_cold_water

def sum_warm_water_floor(building_uid: str, floor: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_hot_water = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type)
        sum = db.session.query(func.sum(column)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor, models.Rooms.shaft == shaft)).scalar()
        if sum is not None:
            sanitary_values =  get_sanitary_equipment_values(e_type)
            total_hot_water = total_hot_water + (sum * sanitary_values.water_flow_warm_water)
    #print(f"Total warm water: {total_hot_water}")
    return total_hot_water

def get_all_sanitary_equipment_types() -> list[str]:
    equipment_types = db.session.query(models.SanitaryEquipmentWaterData.equipment_type).all()
    equipment_list = [et[0] for et in equipment_types]
    return equipment_list

def sum_drainage_equipment_shaft(project_uid: str, equipment: str, shaft: str) -> float:
    equipment_values = get_sanitary_equipment_values(equipment)
    drainage_value = equipment_values.water_flow_drainage
    column = getattr(models.Rooms, equipment)
    sum_equipment_type = db.session.query(func.sum(column)).filter(and_(models.Rooms.shaft == shaft, models.Rooms.project_uid == project_uid)).scalar()
    sum_drainage = 0
    if sum_equipment_type is not None:
        sum_drainage = sum_equipment_type * drainage_value
    return sum_drainage

def sum_drainage_shaft(project_uid: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    sum = 0
    for type in equipment_types:
        sum = sum + sum_drainage_equipment_shaft(project_uid, type, shaft)
    return sum

# water_type is either "cw" for cold water or "ww" for warm water
def get_largest_water_outlet(building_uid: str, shaft: str, water_type: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    installed_equipment = []
    largest_outlet = 0
    for equipment in equipment_types:
        column = getattr(models.Rooms, equipment)
        installed = db.session.query(column).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.shaft == shaft, column > 0)).first()
        if installed:
            installed_equipment.append(equipment)
    for item in installed_equipment:
        item_value = get_sanitary_equipment_values(item)
        if water_type == "cw":
            if item_value.water_flow_cold_water > largest_outlet:
                largest_outlet = item_value.water_flow_cold_water
        elif water_type == "ww":
            if item_value.water_flow_warm_water > largest_outlet:
                largest_outlet = item_value.water_flow_warm_water
    return largest_outlet

'''
Simultaneity calculations
'''
def simultanius_drainage(sum: float, graph_curve: str) -> float:
    #print(f"Calculating simultanious draining. Sum drainage: {sum}. Graph curve: {graph_curve}")
    graph_curve_value = 0
    if graph_curve == "A":
        graph_curve_value = 0.26
    elif graph_curve == "B":
        graph_curve_value = 0.123
    else:
        return None
    simultanius_drainage = 10 ** (0.46 * math.log10(sum) - graph_curve_value)
    return simultanius_drainage

# Same formula for cold and hot water
def simultanius_tap_water(sum: float, largest_outlet: float) -> float:
    #print(f"Calculating simultanious tap water. Sum water: {sum}. Largest outlet: {largest_outlet}")
    if largest_outlet > sum:
        return largest_outlet
    else:
        flow = largest_outlet + 0.015 * (sum - largest_outlet) + 0.17 * math.sqrt(sum - largest_outlet)
        return flow

'''
Pipe size calculations
'''
def pipesize_drainage_vertical(flow: float) -> str:
    #pipe_sizes_iron = ["75", "110", "135", "160", "210", "275"]
    
    if 0 < flow <= 2.4:
        return "75"
    elif 2.4 < flow <= 7.5:
        return "110"
    elif 7.5 < flow <= 13.0:
        return "135"
    elif 13.0 < flow <= 22.0:
        return "160"
    elif 22.0 < flow <= 40.0:
        return "210"
    elif 40.0 < flow <= 80.0:
        return "275"
    elif flow > 80:
        return "NB! Over 80L/s"
    else:
        return "0"

def pipesize_drainage_1_60(flow: float) -> str:
    #pipe_sizes_iron = ["75", "110", "135", "160", "210", "275"]
    #print(f"Flow for drainage pipe size check 1:60: {flow}")
    if 0 < flow <= 0.9:
        #print(f"Flow is {flow}, pipe-size: 75")
        return "75"
    elif 0.9 < flow <= 3.2:
        #print(f"Flow is {flow}, pipe-size: 110")
        return "110"
    elif 3.2 < flow <= 5.5:
        #print(f"Flow is {flow}, pipe-size: 135")
        return "135"
    elif 5.5 < flow <= 9.0:
        #print(f"Flow is {flow}, pipe-size: 160")
        return "160"
    elif 9.0 < flow <= 20.0:
        #print(f"Flow is {flow}, pipe-size: 210")
        return "210"
    elif 20.0 < flow <= 40.0:
        #print(f"Flow is {flow}, pipe-size: 275")
        return "275"
    elif flow > 40:
        return "NB! Over 40L/s"
    else:
        return "0"
    
# Same formula for cold and hot water
def pipesize_tap_water(flow: float) -> str:
    if 0 < flow < 0.4:
        return "15"
    elif 0.4 < flow <= 0.5:
        return "18"
    elif 0.5 < flow <= 0.6:
        return "22"
    elif 0.6 < flow <= 1.1:
        return "28"
    elif 1.1 < flow <= 1.8:
        return "35"
    elif 1.8 < flow <= 2.8:
        return "42"
    elif 2.8 < flow <= 4.5:
        return "54"
    elif 4.5 < flow <= 5.9:
        return "65"
    elif 5.9 < flow <= 8:
        return "80"
    elif 8 < flow <= 12:
        return "100"
    elif 12 < flow <= 15:
        return "150"
    elif flow > 15:
        return "200"