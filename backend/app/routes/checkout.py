from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..serializers import sale_data
from ..services.checkout_service import checkout

checkout_bp = Blueprint("checkout", __name__)


def json_body():
    return request.get_json(silent=True)


@checkout_bp.post("/guest")
def guest_checkout():
    sale = checkout(json_body())
    return jsonify({"sale": sale_data(sale)}), 201


@checkout_bp.post("/authenticated")
@jwt_required()
def authenticated_checkout():
    sale = checkout(json_body(), authenticated_identity=get_jwt_identity())
    return jsonify({"sale": sale_data(sale)}), 201
