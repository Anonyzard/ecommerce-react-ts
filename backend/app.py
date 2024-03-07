from flask import Flask, jsonify
from flask_smorest import Api
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

from db import db
from blocklist import BLOCKLIST
from passlib.hash import pbkdf2_sha256

from resources.user import blp as UserBlueprint
from resources.item import blp as ItemBlueprint
from resources.tag import blp as TagBlueprint
from resources.order import blp as OrderBlueprint

from models import *


def create_app(db_url=None):
    app = Flask(__name__)
    app.config["API_TITLE"] = "Stores REST API"
    app.config["API_VERSION"] = "v1"
    app.config["OPENAPI_VERSION"] = "3.0.3"
    app.config["OPENAPI_URL_PREFIX"] = "/"
    app.config["OPENAPI_SWAGGER_UI_PATH"] = "/swagger-ui"
    CORS(app, resources={r"/*"})

    proto='mysql+mysqlconnector'
    user='root'
    passwd='password'
    ip='172.27.0.2'
    ip='localhost'
    # ip='/run/mysqld/mysqld.sock'
    port='3306'
    bd='bdflasksqlalchemy'
    opts='charset=utf8mb4&collation=utf8mb4_general_ci'
    app.config[
        "OPENAPI_SWAGGER_UI_URL"
        ] = "https://cdn.jsdelivr.net/npm/swagger-ui-dist/"
    app.config[
        'SQLALCHEMY_DATABASE_URI'
        ] = f'{proto}://{user}:{passwd}@{ip}:{port}/{bd}?{opts}'
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+mysqlconnector://root:password@172.16.0.17:3306/bdtestsqlalchemy?charset=utf8mb4&collation=utf8mb4_general_ci'
    # app.config['SQLALCHEMY_DATABASE_URI'] = f'{proto}://{user}:{passwd}@{ip}:{port}/{bd}?{opts}'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    # app.config["SQLALCHEMY_DATABASE_URI"] = db_url or "sqlite:///data.db"
    #app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["PROPAGATE_EXCEPTIONS"] = True
    db.init_app(app)
    migrate = Migrate(app, db)
    api = Api(app)
    with app.app_context():
        toadd=False
        db.create_all()
        user_root_query = UserModel.query.filter_by(email='anonyzard@disroot.org').first()
        user_root = UserModel(firstname='root', lastname='', 
            password=pbkdf2_sha256.hash('toor'), phone='1234567890', admin=True,
            email='anonyzard@disroot.org')
        if not user_root_query:
            db.session.add(user_root)
            db.session.commit()
            # access_token = create_access_token(identity=1, fresh=True, exp=None)
            # refresh_token = create_refresh_token(user.id)
            # print("access_token: ${access_token}, refresh_token: ${refresh_token}")
        #     toadd=True

        # store_query = StoreModel.query.filter_by(id=1).first()
        # store = StoreModel(id=1, name='E-Commerce')
        # if not store_query:
        #     db.session.add(store)
        #     toadd=True
        # if toadd:
        #     db.session.commit()

        item1_query = ItemModel.query.filter_by(id=1).first()
        if not item1_query:
            item1 = ItemModel(id=1, name='Silla', description='Sientate como en casa', 
                price=50.00,
                image="https://images.unsplash.com/photo-1506332088442-9e0024864f5d?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D")
            db.session.add(item1)
            db.session.commit()

    app.config["JWT_SECRET_KEY"] = "jose"
    jwt = JWTManager(app)

    # @jwt.additional_claims_loader
    # def add_claims_to_jwt(identity):
    #     # TODO: Read from a config file instead of hard-coding
    #     if identity == 1:
    #         return {"is_admin": True}
    #     return {"is_admin": False}

    @jwt.token_in_blocklist_loader
    def check_if_token_in_blocklist(jwt_header, jwt_payload):
        return jwt_payload["jti"] in BLOCKLIST

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return (
            jsonify({"message": "The token has expired.", "error": "token_expired"}),
            401,
        )

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return (
            jsonify(
                {"message": "Signature verification failed.", "error": "invalid_token"}
            ),
            401,
        )

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return (
            jsonify(
                {
                    "description": "Request does not contain an access token.",
                    "error": "authorization_required",
                }
            ),
            401,
        )

    @jwt.needs_fresh_token_loader
    def token_not_fresh_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {
                    "description": "The token is not fresh.",
                    "error": "fresh_token_required",
                }
            ),
            401,
        )

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        return (
            jsonify(
                {"description": "The token has been revoked.", "error": "token_revoked"}
            ),
            401,
        )


    api.register_blueprint(UserBlueprint)
    api.register_blueprint(ItemBlueprint)
    api.register_blueprint(OrderBlueprint)
    api.register_blueprint(TagBlueprint)

    return app
