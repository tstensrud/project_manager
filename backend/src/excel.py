from . import db_operations as db
from openpyxl import Workbook
import os
from uuid import uuid4

def generate_excel_report(project_uid: str, vent=False, heating=False, cooling=False, sanitary=False) -> str:
    project = db.get_project(project_uid)
    project_name = project.project_name.replace(" ", "")
    project_rooms = db.get_all_project_rooms_excel(project_uid)

    workbook = Workbook()
    sheet = workbook.active

    file_folder = os.path.join('static', 'excel')
    os.makedirs(file_folder, exist_ok=True)
    
    if vent:
        filename = f"{project_name}Luftmengdetabell{str(uuid4())}"
        column_titles = ["Bygg", "Etasje", "Romnr", "Rom", "Personer (stk)", "Luft per person (m3/pers)", "Sum personer (m3/h)", "Emisjon (m3/h)",
                        "Sum emisjon (m3/h)", "Prosess (m3/h)", "Minimum (m3/h)", "Dimensjonert (m3/h)", "Tilluft (m3/h)",
                        "Avtrekk (m3/h)", "Min (m3/m2)", "System", "Ventilasjonsprinsipp", "Gjenvinner", "Styring", "Presiseringer",
                        "dB teknisk", "db naborom", "db korridor"]
        sheet.append(column_titles)
        for room in project_rooms:
            room_data = room.get_json_room_data()
            vent_data = room.get_json_ventilation_data()
            system_name = vent_data["SystemName"]
            data = [room_data["BuildingName"], room.floor, room.room_number, room.room_name, room.room_population,
                                room.air_per_person, room.air_person_sum, room.air_emission, room.air_emission_sum, room.air_process,
                                room.air_minimum, room.air_demand, room.air_supply, room.air_extract, system_name, room.vent_principle,
                                room.heat_exchange, room.room_control, room.notes, room.db_technical, room.db_neighbour, room.db_corridor]
            sheet.append(data)

    elif heating:
        filename = f"{project_name}Varmetapsberegning{str(uuid4())}"
        column_titles = ["Bygg", "Etasje", "Romnr", "Rom", "Personer (stk)", "Areal yttervegg", "Romhøyde",
                        "Areal vindu/dører", "Areal tak", "Areal gulv på grunn", "Areal gulv mot fritt",
                        "Kuldebroverdi", "Transmissjonstap", "Infiltrasjon", "Sum varmetap (W)", "Valgt varme (W)",
                        "Varmekilde"]
        sheet.append(column_titles)
        for room in project_rooms:
            room_data = room.get_json_room_data()
            data = [room_data["BuildingName"], room.floor, room.room_number, room.room_name, room.room_population,
                                    room.outer_wall_area, room.room_height, room.window_door_area, room.roof_area, room.floor_ground_area,
                                    room.floor_air_area, room.heatloss_cold_bridge, room.heatloss_transmission, room.heatloss_infiltration,
                                    room.heatloss_sum, room.chosen_heating, room.heat_source]
            sheet.append(data)

    elif cooling:
        filename = f"{project_name}Kjøleberegninger{str(uuid4())}"
        column_titles = ["Bygg", "Etasje", "Romnr", "Rom", "Personer (stk)", "Romtemperatur sommer (C)", "Personbelastning (W/pers)",
                         "Internlast lys (W/m2)", "Soltilskudd", "Solreduksjon", "Temp ventilasjon sommer (C)", "Sum internlast personer (W)",
                         "Sum internlast lys (W)", "Internlast utstyr (W)", "Sum internlast (W)"]
        sheet.append(column_titles)
        for room in project_rooms:
            room_data = room.get_json_room_data()
            data = [room_data["BuildingName"], room.floor, room.room_number, room.room_name, room.room_population,
                                                room.room_temp_summer, room.internal_heatload_people, room.internal_heatload_lights,
                                                room.sun_adition, room.sun_reduction, room.ventair_temp_summer, room.sum_internal_heatload_people,
                                                room.sum_internal_heatload_lights, room.internal_heatload_equipment, room.sum_internal_heatload]
            sheet.append(data)
                
    # Save file
    try:
        workbook.save(filename=os.path.join(file_folder, f"{filename}.xlsx"))
        return f"{filename}.xlsx"
    except Exception as e:
        print(f"Could not generate xlsx-file: {e}")
        return None

