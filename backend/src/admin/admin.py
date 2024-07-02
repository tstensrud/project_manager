from flask import Blueprint, redirect, url_for, render_template, flash, request
from flask_login import current_user
from .. import models, db
from .. import db_ops_admin as dboa
from .. import globals
from werkzeug.security import generate_password_hash
from functools import wraps
from markupsafe import escape
from flask_jwt_extended import jwt_required
from ..import db_ops_users as dbou
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

admin_bp = Blueprint('admin', __name__, template_folder="templates", static_folder="static")

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not current_user.is_authenticated or not current_user.admin:
            globals.log(f"Unauthorized attempt to access admin page by {current_user.name}")
        return f(*args, **kwargs)
    return decorated_function

@jwt_required()
@admin_required
def send_user_email(subject: str, body: str, to_email: str) -> bool:
    from_email = "structortsit@gmail.com"
    password = "blablalba"

    return True
        

@jwt_required()
@admin_required
@admin_bp.route('/', methods=['GET', 'POST'])
def admin():
    endpoint = request.endpoint
    if request.method == "GET":
        users = dbou.get_users()
        return render_template("admin.html",
                            user=current_user,
                            users=users,
                            endpoint=endpoint)
    elif request.method == "POST":
        user_id = escape(request.form.get("user_id"))
        print(user_id)
        if user_id == "1":
            return redirect(url_for("admin.admin"))    
        user = dbou.get_user(int(user_id))
        user.is_active = not user.is_active
        db.session.commit()
        return redirect(url_for("admin.admin"))


@jwt_required()
@admin_required
@admin_bp.route('/new_user', methods=['POST'])
def new_user():
    
    email = escape(request.form.get("email").strip())
    name = escape(request.form.get("name").strip())
    password = escape(request.form.get("password").strip())
    

    if dboa.find_existing_user(email):
        flash("Email allerede registrert", category="error")
    else:
        new_user = models.User(email=email, name=name, password=generate_password_hash(password, method='scrypt'))
        subject = "Konto opprettet"
        body = f"Din nye brukerkonto hos Structor TS IT er opprettet. \n Brukernavn er {email}.\n Passord: {password}"    
        if send_user_email(subject, body, email):
            try:
                db.session.add(new_user)
                db.session.commit()
            except Exception as e:
                flash(f"Kunne ikke opprette bruker: {e}", category="error")
        else:
            flash(f"Kunne ikke opprette epost-forbindelse: {e}", category="error")
    return redirect(url_for("admin.admin"))
