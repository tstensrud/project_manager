import json
from flask import Blueprint, jsonify, request
from .. import db_operations as dbo
from .. import db_ops_users as dbu
from .. import db_ops_admin as dba
from functools import wraps

admin_bp = Blueprint('admin', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_method(*args, **kwargs):
        user = dbu.get_user(uuid)
        

@admin_bp.route('/', methods=['GET'])
def admin():
    pass



