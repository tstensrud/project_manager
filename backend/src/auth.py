from flask import Blueprint, request, flash, redirect, url_for
from .models import User
from werkzeug.security import check_password_hash
from flask_login import login_required, login_user, logout_user
from markupsafe import escape

auth = Blueprint("auth", __name__)

'''
Log in
'''
@auth.route('/', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        email = escape(request.form.get('email'))
        password =  escape(request.form.get('password'))

        user = User.query.filter_by(email=email).first()
        if user:
            if check_password_hash(user.password, password):
                login_user(user, remember=True)
                return redirect(url_for("projects.projects"))
            else:
                flash("Feil i brukernavn eller passord.", category="error")
        else:
            flash("Email finnes ikke", category="error")

    flash("Kunne ikke logge inn", category="error")

'''
Log out
'''
@auth.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for("views.index"))

