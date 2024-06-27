
from sqlalchemy import func, and_
from . import models, db
from flask_login import login_required
import math
from . import globals

'''
Heating
'''
#@login_required
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

#@login_required
def new_room_energy(building_energy_settings_id: int, room_id: int) -> bool:
    val = 1
    new_room = models.RoomEnergyProperties(room_id = room_id,
                                                building_energy_settings = building_energy_settings_id,
                                                outer_wall_area = val,
                                                room_height = val,
                                                window_door_area = val,
                                                inner_wall_area = val,
                                                roof_area = val,
                                                floor_ground_area = val,
                                                floor_air_area = val,
                                                room_volume = val,
                                                heatloss_cold_bridge = val,
                                                heatloss_transmission = val,
                                                heatloss_infiltration = val,
                                                heatloss_ventilation = val,
                                                heatloss_sum = val,
                                                chosen_heating = val,
                                                heat_source = "",
                                                room_temp_summer = 26.0,
                                                internal_heatload_people = 100,
                                                internal_heatload_lights = 7.0,
                                                ventair_temp_summer = 18.0,
                                                sum_internal_heatload_people = val,
                                                sum_internal_heatload_lights = val,
                                                internal_heatload_equipment = val,
                                                sun_adition = val,
                                                sun_reduction = val,
                                                sum_internal_heatload = val,
                                                cooling_ventilationair = val,
                                                cooling_equipment = val,
                                                cooling_sum = val)
    try:
        db.session.add(new_room)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new room heating props: {e}")
        db.session.rollback()
        return False

#@login_required
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

#@login_required
def get_room_energy_data(energy_room_id: int) -> models.RoomEnergyProperties:
    room = db.session.query(models.RoomEnergyProperties).filter(models.RoomEnergyProperties.id == energy_room_id).first()
    return room

#@login_required
def update_room_heating_data(energy_room_id: int, data) -> bool:
    room = get_room_energy_data(energy_room_id)
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

#@login_required
def infiltration_loss(delta_t_inside_outside: float, room_volume: float, air_change_per_hour: float) -> float:
    infiltration_loss = 0.28 * 1.2 * delta_t_inside_outside * room_volume * air_change_per_hour
    return infiltration_loss

#@login_required
def ventilation_loss(air_flow_per_area: float, room_area: float, indoor_temp: float, vent_air_temp: float) -> float:
    ventilation_loss = 0.35 * air_flow_per_area * room_area * (indoor_temp - vent_air_temp)
    return ventilation_loss

#@login_required
def calculate_total_heat_loss_for_room(energy_room_id: int) -> bool:
    try:
        room = get_room_energy_data(energy_room_id)
        if not room:
            #print(f"No room found for heating_room_id: {heating_room_id}")
            return False

        building = room.building_energy_settings
        if not building:
            #print(f"No building settings found for room with heating_room_id: {heating_room_id}")
            return False
        room_data = room.room_energy  
        dt_surfaces_to_air = building.InsideTemp - building.dut
        dt_floor_ground = building.InsideTemp - building.year_mid_temp
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
        room_cold_bridge_loss = building.cold_bridge_value * room_data.Area * dt_surfaces_to_air
        room_ventilation_loss = ventilation_loss((room_data.ventilation_properties.AirSupply / room_data.Area), room_data.Area, building.InsideTemp, building.vent_temp)
        room_infiltration_loss = infiltration_loss(dt_surfaces_to_air, (room_data.Area * room.room_height), building.infiltration)
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

#@login_required
def get_all_rooms_energy_building(building_id: int) -> list:
    rooms = db.session.query(models.RoomEnergyProperties).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).all()
    if not rooms:
        print(f"No rooms found for building_id: {building_id}")
    else:
        print(f"Found {len(rooms)} rooms for building_id: {building_id}")
    return rooms

#@login_required
def get_energy_settings_all_buildings(project_id: int):
    heating_settings = db.session.query(models.BuildingEnergySettings).join(models.Projects).filter(models.BuildingEnergySettings.project_id == project_id).all()
    return heating_settings

#@login_required
def get_building_energy_settings(building_id: int) -> models.BuildingEnergySettings:
    settings = db.session.query(models.BuildingEnergySettings).join(models.Buildings).filter(models.Buildings.id == building_id).first()
    return settings

#@login_required
def sum_heat_loss_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.heatloss_sum)).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return heat_loss

#@login_required
def sum_heat_loss_chosen_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.chosen_heating)).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    print("WE CALCULATED HEATLOSS")
    return heat_loss

#@login_required
def sum_heat_loss_project(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.heatloss_sum)).join(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss

#@login_required
def sum_heat_loss_project_chosen(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.chosen_heating)).join(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss

'''
Cooling
'''

#@login_required
def update_internal_heat_loads(energy_room_id: int) -> bool:
    room = get_room_energy_data(energy_room_id)


#@login_required
def set_standard_cooling_settings(room_id: int, data) -> bool:
    room = get_room_energy_data(room_id)
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

#@login_required
def calculate_heat_loads_for_room(energy_room_id: int) -> bool:
    room = get_room_energy_data(energy_room_id)
    room.sum_internal_heatload_lights = room.internal_heatload_lights * room.room_energy.Area
    room.sum_internal_heatload_people = room.internal_heatload_people * room.room_energy.RoomPopulation
    room.sum_internal_heatload = (room.sun_adition * room.sun_reduction) + room.internal_heatload_equipment
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Calculate heat lods for room: {e}")
        return False


#@login_required
def calculate_total_cooling_for_room(energy_room_id: int) -> bool:
    if calculate_heat_loads_for_room(energy_room_id):
        room = get_room_energy_data(energy_room_id)   
        
        heatload_sun = room.sun_adition * room.sun_reduction
        sum_internal_heat_loads = room.sum_internal_heatload_people + room.sum_internal_heatload_lights + room.internal_heatload_equipment + heatload_sun
        
        cooling_from_vent = 0.35 * room.room_energy.ventilation_properties.AirSupply * (room.room_temp_summer - room.ventair_temp_summer)
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

#@login_required
def update_room_data_cooling(energy_room_id: int, data) -> bool:
    print(data)
    room = get_room_energy_data(energy_room_id)
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
    if calculate_total_cooling_for_room(energy_room_id):
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