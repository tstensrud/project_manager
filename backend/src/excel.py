from . import db_operations as db
from openpyxl import Workbook
import os
from uuid import uuid4

def generate_sheet_ventilation(project_uid):
    project = db.get_project(project_uid)
    project_name = project.project_name

    workbook = Workbook()

    file_path = os.path.abspath(__file__)
    folder_path = os.path.dirname(file_path)

    file_folder = os.path.join(folder_path, 'generated_excel')
    os.makedirs(file_folder, exist_ok=True)
    filename = f"{project_name} - Luftmengdetabell - {str(uuid4())}"

    sheet = workbook.active

    # Generate column headers
    columns_ids = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "O"]
    column_titles = ["Bygg", "Etasje", "Romnr", "Rom", "Personer (stk)", "Sum personer (m3/h)", "Sum emisjon (m3/h)", "Prosess (m3/h)", "Dimensjonert (m3/h)", "Tilluft (m3/h)", "Avtrekk (m3/h)", "Min (m3/m2)", "System"]

    for column_id, column_title in zip(columns_ids, column_titles):
        sheet[f"{column_id}1"] = column_title

    
    project_rooms = db.get_all_project_rooms_excel(project_uid)
    for room in project_rooms:
        room_data = room.get_json_room_data()
        vent_data = room.get_json_ventilation_data()
        system_name = vent_data["SystemName"]
        vent_data_to_excel = [room_data["BuildingName"], room.floor, room.room_number, room.room_name, room.room_population,
                              room.air_person_sum, room.air_emission_sum, room.air_process, room.air_demand, room.air_supply,
                              room.air_extract, room.air_minimum, system_name]
        sheet.append(vent_data_to_excel)


    # Save file
    workbook.save(filename=os.path.join(file_folder, f"{filename}.xlsx"))

def generate_excel_heating(project_uid):
    project = db.get_project(project_uid)
    project_name = project.project_name

    workbook = Workbook()

    file_path = os.path.abspath(__file__)
    folder_path = os.path.dirname(file_path)

    file_folder = os.path.join(folder_path, 'generated_excel')
    os.makedirs(file_folder, exist_ok=True)
    filename = f"{project_name} - Varmetapsberegning - {str(uuid4())}"

    sheet = workbook.active

    # Generate column headers
    columns_ids = ["A", "B", "C", "D", "E", "F", "G", "H"]
    column_titles = ["Bygg", "Etasje", "Romnr", "Rom", "Personer (stk)", "Sum varmetap (W)", "Valgt varme (W)", "Varmekilde"]

    for column_id, column_title in zip(columns_ids, column_titles):
        sheet[f"{column_id}1"] = column_title

    project_rooms = db.get_all_project_rooms_excel(project_uid)
    
    for room in project_rooms:
        room_data = room.get_json_room_data()
        heating_data_to_excel = [room_data["BuildingName"], room.floor, room.room_number, room.room_name, room.room_population,
                                 room.heatloss_sum, room.chosen_heating, room.heat_source]
        sheet.append(heating_data_to_excel)

    # Save file
    workbook.save(filename=os.path.join(file_folder, f"{filename}.xlsx"))