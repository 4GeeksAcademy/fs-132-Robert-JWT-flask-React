"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=["POST"])
def register():
    # extraemos info del body
    body = request.get_json()
    # verificamos informacion
    if not body["email"] or not body["password"]:
        return jsonify({"success": False, "data": "missing data"}), 403
    # verificamos si el usuario existe en la base de datos
    # <---esto hace:<sqlalchemy.engine.result.ChunkedIteratorResult object at 0x74aa4219e910> --> scalar_one_or_none() --> <User 1> or None
    user = db.session.execute(select(User).where(
        User.email == body["email"])).scalar_one_or_none()
    if user:
        return jsonify({"success": False, "data": "user already exists"}), 403
    # si no existe el usuario, lo creamos
    new_user = User(
        email=body["email"],
        password=body["password"],
        is_active=True
    )
    db.session.add(new_user)
    db.session.commit()

    return jsonify({"success": True, "data": "user created, log in"}), 201


@api.route('/login', methods=["POST"])
def login():

    # extraemos info del body
    body = request.get_json()

    # verificamos informacion
    if not body["email"] or not body["password"]:
        return jsonify({"success": False, "data": "missing data"}), 403 
    
    # verificamos si el usuario existe en la base de datos
    user = db.session.execute(select(User).where(
        User.email == body["email"])).scalar_one_or_none()# <---esto hace:<sqlalchemy.engine.result.ChunkedIteratorResult object at 0x74aa4219e910> --> scalar_one_or_none() --> <User 1> or None
    
    if not user:
        return jsonify({"success": False, "data": "email not found"}), 404

    if user.password != body["password"]:
        return jsonify({"success": False, "data": "email/password wrong"}), 403

    # generar el token y convertirmos el user.id a string

    token = create_access_token(identity=str(user.id))

    return jsonify({"succes": True, "token":token}), 201

@api.route("/me", methods=["GET"])
@jwt_required() #protegemos la ruta, sin token, no se pasa, al mas puro estilo Gandalf
def get_user_info():
    id = get_jwt_identity() #extraemos id del token
    print('user id is -> ',id)
    user = db.session.get(User, id) #usamos id para buscar la info en BD
    return jsonify({"success": True, "data": user.serialize()}), 201 #devolvemos el serialize del user