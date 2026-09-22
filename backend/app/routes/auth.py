from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..serializers import user_data
from ..services import auth_service

auth_bp = Blueprint("auth", __name__)


def json_body():
    data = request.get_json(silent=True)
    return data if isinstance(data, dict) else {}


@auth_bp.post("/register")
def register():
    user = auth_service.register(json_body())
    return jsonify({"user": user_data(user)}), 201


@auth_bp.post("/login")
def login():
    user, token = auth_service.login(json_body())
    return jsonify({"access_token": token, "user": user_data(user)})


@auth_bp.get("/me")
@jwt_required()
def me():
    user = auth_service.get_authenticated_user(get_jwt_identity())
    return jsonify({"user": user_data(user)})


@auth_bp.patch("/change-password")
@jwt_required()
def change_password():
    user = auth_service.change_password(get_jwt_identity(), json_body())
    return jsonify({"user": user_data(user)})


@auth_bp.patch("/change-email")
@jwt_required()
def change_email():
    user = auth_service.change_email(get_jwt_identity(), json_body())
    return jsonify({"user": user_data(user)})