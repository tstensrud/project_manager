from datetime import timedelta
from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
#from dotenv import load_dotenv
import os

#load_dotenv()
db = SQLAlchemy()
DB_NAME = "projects.db"

def create_app():
    app = Flask(__name__)
    CORS(app)
    jwt = JWTManager(app)
    app.config['SECRET_KEY'] = "9UE5CwQRIJqM5O2SbDifX"
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    #app.config['SQLALCHEMY_ECHO'] = True
    app.config['JWT_SECRET_KEY'] = "ASsaf39834578DJYACDS1234fwec1af521f35f1"
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
    
    #app.config['UPLOAD_FOLDER'] = ".static/excel"
    db.init_app(app)

        
    from .views import views
    from .api import project_api
    from .projects import projects
    from .specifications import specifications
    from .userprofile import user
    #from .admin import admin

    app.register_blueprint(user.user_bp, url_prefix='/user')
    app.register_blueprint(projects.projects_bp, url_prefix='/projects')
    app.register_blueprint(specifications.specifications_bp, url_prefix='/specifications')
    app.register_blueprint(project_api.project_api_bp, url_prefix='/project_api/<project_uid>/')
    #app.register_blueprint(admin.admin_bp, url_prefix="/admin/")
    

    app.register_blueprint(views, url_prefix='/')

    from .models import Users
    create_db(app)

    login_manager = LoginManager()
    login_manager.login_view = "views.token"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return Users.query.get(int(id))
    
    @app.before_request
    def before_request():
        if request.method == "OPTIONS":
            return '',200

    return app

def create_db(app):
    if not path.exists('romskjema/' + DB_NAME):
        with app.app_context():
            db.create_all()



    