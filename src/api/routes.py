"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from sqlalchemy import select
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/auth', methods=['POST'])
def auth():
    body = request.get_json()
    print(body)
    if not body["email"] or not body["password"]:
        return jsonify({"success": False, "data": "missing info"}), 403 
    
    user = db.session.execute(select(User).where(User.email == body["email"])).scalar_one_or_none()

    if body['type'] == 'register':
        if user: 
            return jsonify({"success": False, "data": "email taken"}), 403 
        print(body['password'])
        hashed = generate_password_hash(body["password"]) #hasheamos contraseña
        print('password despues del hash', hashed)
        new_user = User(
            email = body["email"],
            password = hashed,
            is_active = True
        ) 
        db.session.add(new_user)
        db.session.commit()
        token = create_access_token(identity=str(new_user.id))
        return jsonify({"success": True, "data": new_user.serialize(), "token": token}), 201
    
    if body["type"] == 'login':
        if not user:
           return jsonify({"success": False, "data": "email not found"}), 404  
        #comparar contraseñas 
        if not check_password_hash(user.password, body["password"]):
            return jsonify({"success": False, "data": "email/password bad"}), 401  
        token = create_access_token(identity=str(user.id))
        return jsonify({"success": True, "data": user.serialize(), "token": token}), 200

    return jsonify({"success": False, "data": "?????"}), 418  

@api.route('/me', methods=["GET"])
@jwt_required() #solo se puede acceder con el token
def get_me():
    id = get_jwt_identity() #extraemos del token la identidad (que es el id del usuario)
    user = db.session.get(User,id)
    if not user:
           return jsonify({"success": False, "data": "??que me has enviado???"}), 418 #--> I'm a teapot
    return jsonify({"success": True, "data": user.serialize()})
