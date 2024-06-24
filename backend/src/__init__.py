from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from os import path
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
DB_NAME = "db.db"

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = "9UE5CwQRIJqM5O2SbDifX"
    app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{DB_NAME}"
    
    db.init_app(app)

        
    from .views import views
    from .auth import auth

    #from .admin import admin
    #from .rooms import rooms
    #from .ventilation import ventilation
    #from. project import project
    from .projects import projects
    #from .ventsystems import ventsystems
    #from .buildings import buildings
    from .specifications import specifications
    #from .heating import heating
    #from .cooling import cooling
    #from .userprofile import user
    
    #app.register_blueprint(user.user_bp, url_prefix='/user/<username>')
    #app.register_blueprint(admin.admin_bp, url_prefix='/admin')
    app.register_blueprint(projects.projects_bp, url_prefix='/projects')
    app.register_blueprint(specifications.specifications_bp, url_prefix='/specifications')
    #app.register_blueprint(rooms.rooms_bp, url_prefix='/<project_id>/rooms')
    #app.register_blueprint(ventilation.ventilation_bp, url_prefix='/<project_id>/ventilation')
    #app.register_blueprint(project.project_bp, url_prefix='/<project_id>/project')
    #app.register_blueprint(ventsystems.ventsystems_bp, url_prefix='/<project_id>/ventsystems')
    #app.register_blueprint(buildings.buildings_bp, url_prefix='/<project_id>/buildings')
    #app.register_blueprint(heating.heating_bp, url_prefix='/<project_id>/heating')
    #app.register_blueprint(cooling.cooling_bp, url_prefix='/<project_id>/cooling')
    

    app.register_blueprint(views, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User
    create_db(app)

    login_manager = LoginManager()
    login_manager.login_view = "auth.login"
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(id):
        return User.query.get(int(id))
    
    return app

def create_db(app):
    if not path.exists('romskjema/' + DB_NAME):
        with app.app_context():
            db.create_all()



    