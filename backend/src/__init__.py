from datetime import timedelta
import firebase_admin
from flask import Flask, request, session
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from dotenv import load_dotenv
from firebase_admin import credentials
import os

db = SQLAlchemy()
DB_NAME = "projects.db"

def create_app():
    app = Flask(__name__)
    CORS(app)
    load_dotenv()

    firebase_credentials = os.getenv("FIREBASE_CREDENTIALS")
    if not firebase_credentials:
        raise ValueError("Firebase crendtials not found")
    
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate(firebase_credentials)
            firebase_admin.initialize_app(cred)
    except Exception as e:
        print(f"Error initializing firebase: {e}")
        raise


    #jwt = JWTManager(app)
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('EXTERNAL_DB_URL')
    #app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URI')
    #app.config['SQLALCHEMY_ECHO'] = True
    #app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    #app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)
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

    #login_manager = LoginManager()
    #login_manager.login_view = "views.token"
    #login_manager.init_app(app)

    #@login_manager.user_loader
    #def load_user(id):
    #    return Users.query.get(int(id))
    
    @app.before_request
    def before_request():
        if request.method == "OPTIONS":
            return '',200

    return app
