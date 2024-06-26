from flask import session, request, g
from . import db_operations as dbo
from . import models
import re
from datetime import datetime

'''
Blueprint globals
'''
def blueprint_setup(bp) -> None:
    @bp.before_request
    def set_project_id():
        g.project_id = request.view_args.get("project_id")

    @bp.context_processor
    def todo_list():
        project_id = g.get("project_id")
        todo_dict = dbo.get_project_todo_items(project_id)
        return dict(todo_list=todo_dict)



def get_project() -> models.Projects:
    project_id = session.get('project_id')
    project = models.Projects.query.get(project_id)
    return project

'''
RegExes
'''

def pattern_float(input):
    pattern = r"\d+(\.\d+)?"
    match = re.search(pattern, input)
    if match:
        try:
            return float(match.group())
        except ValueError:
            return False

def pattern_int(input):
    pattern = r"\d+"
    output = re.findall(pattern, input)
    try:
        return int(''.join(output))
    except ValueError:
        return False

def camelcase_to_snake(input):
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', input)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()   

def replace_and_convert_to_float(input: str):
    replaced = input.replace(",", ".")
    try:
        float_value = float(replaced)
        return float_value
    except ValueError:
        return False


def log(entry):
    with open(f"log.txt", "a") as file:
        file.writelines(f"- {datetime.now()}: {entry}\n\n")