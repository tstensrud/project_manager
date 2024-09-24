from . import models, db
from sqlalchemy import func, and_
import math

def get_all_sanitary_equipment_types() -> list[models.SanitaryEquipmentWaterData]:
    equipment = db.session.query(models.SanitaryEquipmentWaterData).all()
    return equipment

def sum_waterflows_building(building_uid: str) -> dict:
    equipment_types = get_all_sanitary_equipment_types()
    total_drainage = 0
    total_cw = 0
    total_ww = 0
    for e_type in equipment_types:
        sum_type = 0
        column = getattr(models.Rooms, e_type.equipment_type)
        sum_type = db.session.query(func.sum(column)).filter(models.Rooms.building_uid == building_uid).scalar()
        if sum_type is not None:
            total_drainage = total_drainage + (sum_type * e_type.water_flow_drainage)
            total_cw = total_cw + (sum_type * e_type.water_flow_cold_water)
            total_ww = total_ww + (sum_type * e_type.water_flow_warm_water)
    return {
        "total_drainage": total_drainage,
        "total_cw": total_cw,
        "total_ww": total_ww
    }

def sums_simul_waterflows_building(building_uid: str, graph_curve: str) -> list[float]:
    sums = []
    water_flows = sum_waterflows_building(building_uid=building_uid)
    largest_water_outlets = get_largest_water_outlet(building_uid, "")
    
    drainage_simul = simultanius_drainage(water_flows['total_drainage'], graph_curve)
    cold_water_simul = simultanius_tap_water(water_flows['total_cw'], largest_water_outlets['largest_cw'])
    warm_water_simul = simultanius_tap_water(water_flows['total_ww'], largest_water_outlets['largest_ww'])
    sums.append(drainage_simul)
    sums.append(cold_water_simul)
    sums.append(warm_water_simul)

    return sums

def sum_waterflows_floor(building_uid: str, floor: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    total_drainage = 0
    total_cw = 0
    total_ww = 0
    for e_type in equipment_types:
        sum = 0
        column = getattr(models.Rooms, e_type.equipment_type)
        sum = db.session.query(func.sum(column)).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.floor == floor, models.Rooms.shaft == shaft)).scalar()
        if sum is not None:
            total_drainage = total_drainage + (sum * e_type.water_flow_drainage)
            total_cw = total_cw + (sum * e_type.water_flow_cold_water)
            total_ww = total_ww + (sum * e_type.water_flow_warm_water)
    return {
        'total_drainage': total_drainage,
        "total_cw": total_cw,
        "total_ww": total_ww
    }

def sum_drainage_equipment_shaft(project_uid: str, equipment_type: str, equipment_value: float, shaft: str) -> float:
    column = getattr(models.Rooms, equipment_type)
    sum_equipment_type = db.session.query(func.sum(column)).filter(and_(models.Rooms.shaft == shaft, models.Rooms.project_uid == project_uid)).scalar()
    sum_drainage = 0
    if sum_equipment_type is not None:
        sum_drainage = sum_equipment_type * equipment_value
    return sum_drainage

def sum_drainage_shaft(project_uid: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    sum = 0
    for type in equipment_types:
        sum = sum + sum_drainage_equipment_shaft(project_uid=project_uid, equipment_type=type.equipment_type,
                                                 equipment_value=type.water_flow_drainage, shaft=shaft)
    return sum

def get_largest_water_outlet(building_uid: str, shaft: str) -> float:
    equipment_types = get_all_sanitary_equipment_types()
    installed_equipment = []
    largest_cw_outlet = 0
    largest_ww_outlet = 0
    
    # Gather all sanitary equipment types that has a value > 0
    for equipment in equipment_types:
        column = getattr(models.Rooms, equipment.equipment_type)
        if shaft == "":
            installed = db.session.query(column).filter(and_(models.Rooms.building_uid == building_uid, column > 0)).first()
        else:
            installed = db.session.query(column).filter(and_(models.Rooms.building_uid == building_uid, models.Rooms.shaft == shaft, column > 0)).first()
        if installed:
            installed_equipment.append(equipment)
    
    # Find largest outlet of installed equipment
    for installed_type in installed_equipment:
        if installed_type.water_flow_cold_water > largest_cw_outlet:
            largest_cw_outlet = installed_type.water_flow_cold_water
        if installed_type.water_flow_warm_water > largest_ww_outlet:
            largest_ww_outlet = installed_type.water_flow_warm_water

    return {
        "largest_cw": largest_cw_outlet,
        "largest_ww": largest_ww_outlet
    }

'''
Simultaneity calculations
'''
def simultanius_drainage(sum: float, graph_curve: str) -> float:
    if sum == 0:
        return 0
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
    if sum == 0:
        return 0
    if largest_outlet > sum:
        return largest_outlet
    else:
        flow = largest_outlet + 0.015 * (sum - largest_outlet) + 0.17 * math.sqrt(sum - largest_outlet)
        return flow

'''
Pipe size calculations
'''
def pipesize_drainage_vertical(flow: float) -> str:    
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
    if 0 < flow <= 0.9:
        return "75"
    elif 0.9 < flow <= 3.2:
        return "110"
    elif 3.2 < flow <= 5.5:
        return "135"
    elif 5.5 < flow <= 9.0:
        return "160"
    elif 9.0 < flow <= 20.0:
        return "210"
    elif 20.0 < flow <= 40.0:
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