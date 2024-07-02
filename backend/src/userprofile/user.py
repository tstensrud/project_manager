from flask import Blueprint, redirect, url_for, render_template, flash, request
from flask_login import current_user
from flask_jwt_extended import jwt_required
from .. import db_ops_users as dbo
from markupsafe import escape


user_bp = Blueprint('user',__name__, static_folder='static', template_folder='templates')


@user_bp.route('/', methods=['GET'])
@jwt_required()
def user_profile(username: str):
    endpoint=request.endpoint
    return render_template('user_profile.html',
                           user=current_user,
                           endpoint=endpoint)


@user_bp.route('/update_password', methods=['POST'])
@jwt_required()
def update_password(username: str):
    user_id = escape(request.form.get("user_id"))
    user = dbo.get_user(user_id)
    if not user:
        flash("Bruker ikke funnet", category="error")
        return redirect(url_for('user.user_profile'))
    else:
        password = escape(request.form.get("password").strip())
        password_confirm = escape(request.form.get("password_confirm").strip())
        if password != password_confirm or len(password) < 8:
            flash("Passord er ikke like. Minst 8 tegn.", category="error")
            return redirect(url_for('user.user_profile', username=username))
        else:
            if dbo.update_password(user.id, password):
                return redirect(url_for('auth.logout'))
            else:
                flash("Kunne ikke oppdatere passord", category="error")
                return redirect(url_for('user.user_profile'))
            

