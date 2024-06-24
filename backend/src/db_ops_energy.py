
from sqlalchemy import func, and_
from . import models, db
from flask_login import login_required
import math
from . import globals

'''
Heating
'''
@login_required
def set_up_energy_settings_building(project_id: int, building_id: int) -> bool:
    building_settings = models.BuildingEnergySettings(ProjectId = project_id,
                                                       BuildingID = building_id,
                                                       InsideTemp = 20.0,
                                                       VentTemp = 18.0,
                                                       Infiltration = 0.15,
                                                       UvalueOuterWall = 0.22,
                                                       UvalueWindowDoor = 0.18,
                                                       UvalueFloorGround = 0.18,
                                                       UvalueFloorAir = 0.18,
                                                       UvalueRoof = .018,
                                                       ColdBridge = 0.06,
                                                       YearMidTemp = 5.0,
                                                       TempFloorAir = -22,
                                                       Dut= -22.0,
                                                       Safety= 10.0)
    try:
        db.session.add(building_settings)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"set up heating settings building: {e}")
        db.session.rollback()
        return False

@login_required
def new_room_energy(building_energy_settings_id: int, room_id: int) -> bool:
    val = 1
    new_room = models.RoomEnergyProperties(RoomId=room_id,
                                            BuildingEnergySettings=building_energy_settings_id,
                                            OuterWallArea = val,
                                            RoomHeight=val,
                                            WindowDoorArea=val,
                                            InnerWallArea=val,
                                            RoofArea=val,
                                            FloorGroundArea=val,
                                            FloorAirArea=val,
                                            RoomVolume=val,
                                            HeatLossColdBridge=val,
                                            HeatLossTransmission=val,
                                            HeatLossInfiltration=val,
                                            HeatLossVentilation=val,
                                            HeatLossSum=val,
                                            ChosenHeating=val,
                                            HeatSource="",
                                            RoomTempSummer=26.0,
                                            InternalLoadPeople=100,
                                            InternalLoadLight=7.0,
                                            VentAirTempSummer=18.0,
                                            SumInternalHeatloadPeople=val,
                                            SumInternalHeatloadLight=val,
                                            InternalHeatloadEquipment=val,
                                            SunAdition=val,
                                            SunReduction=val,
                                            SumInternalHeatLoad=val,
                                            CoolingVentilationAir=val,
                                            CoolingEquipment=val,
                                            CoolingSum=val)
    try:
        db.session.add(new_room)
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"new room heating props: {e}")
        db.session.rollback()
        return False

@login_required
def update_building_heating_settings(updated_data) -> bool:
    building_heat_settings_id = updated_data["id"]
    building_settings = db.session.query(models.BuildingEnergySettings).filter(models.BuildingEnergySettings.id == building_heat_settings_id).first()
    building_settings.InsideTemp = updated_data["inside_temp"]
    building_settings.Dut = updated_data["dut"]
    building_settings.VentTemp = updated_data["vent_temp"]
    building_settings.Infiltration = updated_data["infiltration"]
    building_settings.UvalueOuterWall = updated_data["u_outer"]
    building_settings.UvalueWindowDoor = updated_data["u_window_door"]
    building_settings.UvalueFloorGround = updated_data["u_floor_ground"]
    building_settings.UvalueFloorAir = updated_data["u_floor_air"]
    building_settings.UvalueRoof = updated_data["u_roof"]
    building_settings.ColdBridge = updated_data["cold_bridge"]
    building_settings.YearMidTemp = updated_data["year_mid_temp"]
    building_settings.TempFloorAir = updated_data["temp_floor_air"]
    building_settings.Safety = updated_data["safety"]
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update building settings: {e}")
        db.session.rollback()
        return False

@login_required
def get_room_energy_data(energy_room_id: int) -> models.RoomEnergyProperties:
    room = db.session.query(models.RoomEnergyProperties).filter(models.RoomEnergyProperties.id == energy_room_id).first()
    return room

@login_required
def update_room_heating_data(energy_room_id: int, data) -> bool:
    room = get_room_energy_data(energy_room_id)
    room.OuterWallArea = data["outer_wall_area"]
    room.RoomHeight = data["room_height"]
    room.InnerWallArea = data["inner_wall_area"]
    room.WindowDoorArea = data["window_door_area"]
    room.RoofArea = data["roof_area"]
    room.FloorGroundArea = data["floor_ground_area"]
    room.FloorAirArea = data["floor_air_area"]
    room.HeatSource = data["heat_source"]
    room.ChosenHeating = data["chosen_heating"]
    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"update room heating data: {e}")
        db.session.rollback()
        return False

@login_required
def infiltration_loss(delta_t_inside_outside: float, room_volume: float, air_change_per_hour: float) -> float:
    infiltration_loss = 0.28 * 1.2 * delta_t_inside_outside * room_volume * air_change_per_hour
    return infiltration_loss

@login_required
def ventilation_loss(air_flow_per_area: float, room_area: float, indoor_temp: float, vent_air_temp: float) -> float:
    ventilation_loss = 0.35 * air_flow_per_area * room_area * (indoor_temp - vent_air_temp)
    return ventilation_loss

@login_required
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
        dt_surfaces_to_air = building.InsideTemp - building.Dut
        dt_floor_ground = building.InsideTemp - building.YearMidTemp
        outer_wall_area = room.OuterWallArea - room.WindowDoorArea
        #print(f"dt_surfaces_to_air: {dt_surfaces_to_air}, dt_floor_ground: {dt_floor_ground}, outer_wall_area: {outer_wall_area}")
        
        transmission_loss_outer_walls = building.UvalueOuterWall * dt_surfaces_to_air * outer_wall_area
        transmission_loss_windows_doors = building.UvalueWindowDoor * dt_surfaces_to_air * room.WindowDoorArea
        if room.FloorGroundArea != 0:
            transmission_loss_floor = building.UvalueFloorGround * dt_floor_ground * room.FloorGroundArea
        else:
            transmission_loss_floor = building.UvalueFloorAir * dt_floor_ground * room.FloorAirArea
        transmission_loss_roof = building.UvalueRoof * dt_surfaces_to_air * room.RoofArea
        #print(f"Transmission losses calculated: outer_walls={transmission_loss_outer_walls}, windows_doors={transmission_loss_windows_doors}, floor={transmission_loss_floor}, roof={transmission_loss_roof}")
        room_cold_bridge_loss = building.ColdBridge * room_data.Area * dt_surfaces_to_air
        room_ventilation_loss = ventilation_loss((room_data.ventilation_properties.AirSupply / room_data.Area), room_data.Area, building.InsideTemp , building.VentTemp)
        room_infiltration_loss = infiltration_loss(dt_surfaces_to_air, (room_data.Area * room.RoomHeight), building.Infiltration)
        #print(f"Cold bridge loss: {room_cold_bridge_loss}, ventilation loss: {room_ventilation_loss}, infiltration loss: {room_infiltration_loss}")
        safety = 1 + ((building.Safety) / 100)
        #print(f"Safety: {building.Safety}")
        
        total_heat_loss = safety * (transmission_loss_outer_walls+
                                                    transmission_loss_windows_doors+
                                                    transmission_loss_floor+
                                                    transmission_loss_roof+
                                                    room_cold_bridge_loss+
                                                    room_infiltration_loss+
                                                    room_ventilation_loss)
        room.HeatLossSum = round(total_heat_loss,1)
        #print(f"Total heat loss for room {heating_room_id}: {total_heat_loss}")
    
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"calcualte total heat loss: {e}")
        db.session.rollback()
        return False

@login_required
def get_all_rooms_energy_building(building_id: int) -> list:
    rooms = db.session.query(models.RoomEnergyProperties).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).all()
    if not rooms:
        print(f"No rooms found for building_id: {building_id}")
    else:
        print(f"Found {len(rooms)} rooms for building_id: {building_id}")
    return rooms

@login_required
def get_energy_settings_all_buildings(project_id: int):
    heating_settings = db.session.query(models.BuildingEnergySettings).join(models.Projects).filter(models.BuildingEnergySettings.ProjectId == project_id).all()
    return heating_settings

@login_required
def get_building_energy_settings(building_id: int) -> models.BuildingEnergySettings:
    settings = db.session.query(models.BuildingEnergySettings).join(models.Buildings).filter(models.Buildings.id == building_id).first()
    return settings

@login_required
def sum_heat_loss_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.HeatLossSum)).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return heat_loss

@login_required
def sum_heat_loss_chosen_building(building_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.ChosenHeating)).join(models.Rooms).join(models.Buildings).filter(models.Buildings.id == building_id).scalar()
    return heat_loss

@login_required
def sum_heat_loss_project(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.HeatLossSum)).join(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss

@login_required
def sum_heat_loss_project_chosen(project_id: int) -> float:
    heat_loss = db.session.query(func.sum(models.RoomEnergyProperties.ChosenHeating)).join(models.Rooms).join(models.Buildings).join(models.Projects).filter(models.Projects.id == project_id).scalar()
    return heat_loss

'''
Cooling
'''

@login_required
def update_internal_heat_loads(energy_room_id: int) -> bool:
    room = get_room_energy_data(energy_room_id)


@login_required
def set_standard_cooling_settings(room_id: int, data) -> bool:
    room = get_room_energy_data(room_id)
    room.RoomTempSummer = data["room_temp_summer"] if data["room_temp_summer"] != 0 else room.RoomTempSummer
    room.InternalLoadPeople = data["internal_load_people"] if data["internal_load_people"] != 0 else room.InternalLoadPeople
    room.InternalLoadLight = data["internal_load_light"] if data["internal_load_light"] != 0 else room.InternalLoadLight
    room.VentAirTempSummer = data["vent_temp_summer"] if data["vent_temp_summer"] != 0 else room.VentAirTempSummer
    room.SunAdition = data["sun_adition"] if data["sun_adition"] != 0 else room.SunAdition
    room.SunReduction = data["sun_reduction"] if data["sun_reduction"] != 0 else room.SunReduction


    try:
        db.session.commit()
        return True
    except Exception as e:
        globals.log(f"Set standard cooling settings: {e}")
        db.session.rollback()
        return False

@login_required
def calculate_heat_loads_for_room(energy_room_id: int) -> bool:
    room = get_room_energy_data(energy_room_id)
    room.SumInternalHeatloadLight = room.InternalLoadLight * room.room_energy.Area
    room.SumInternalHeatloadPeople = room.InternalLoadPeople * room.room_energy.RoomPopulation
    room.SumInternalHeatLoad = (room.SunAdition * room.SunReduction) + room.InternalHeatloadEquipment
    try:
        db.session.commit()
        return True
    except Exception as e:
        db.session.rollback()
        globals.log(f"Calculate heat lods for room: {e}")
        return False


@login_required
def calculate_total_cooling_for_room(energy_room_id: int) -> bool:
    if calculate_heat_loads_for_room(energy_room_id):
        room = get_room_energy_data(energy_room_id)   
        
        heatload_sun = room.SunAdition * room.SunReduction
        sum_internal_heat_loads = room.SumInternalHeatloadPeople + room.SumInternalHeatloadLight + room.InternalHeatloadEquipment + heatload_sun
        
        cooling_from_vent = 0.35 * room.room_energy.ventilation_properties.AirSupply * (room.RoomTempSummer - room.VentAirTempSummer)
        sum_cooling = cooling_from_vent + room.CoolingEquipment

        room.CoolingVentilationAir = round(cooling_from_vent, 1)
        room.SumInternalHeatLoad = round(sum_internal_heat_loads, 1)
        room.CoolingSum = round(sum_cooling,1)
        try:
            db.session.commit()
            return True
        except Exception as e:
            globals.log(f"cooling calculatiosn: {e}")
            db.session.rollback()
            return False
    else:
        return False

@login_required
def update_room_data_cooling(energy_room_id: int, data) -> bool:
    print(data)
    room = get_room_energy_data(energy_room_id)
    room.RoomTempSummer = data["room_temp_summer"]
    room.InternalLoadPeople = data["internal_load_people"]
    room.InternalLoadLight = data["internal_load_light"]
    room.InternalHeatloadEquipment = data["internal_load_equipment"]
    room.SunAdition = data["sun_adition"]
    room.SunReduction = data["sun_reduction"]
    room.CoolingEquipment = data["equipment_cooling"]
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