from flask import Blueprint, jsonify
from flask_jwt_extended import get_jwt_identity, jwt_required

from ..serializers import sale_data
from ..services.auth_service import get_authenticated_user
from ..services.sales_service import get_sales_for_user

sales_bp = Blueprint("sales", __name__)


@sales_bp.get("/me")
@jwt_required()
def my_sales():
    user = get_authenticated_user(get_jwt_identity())
    sales = get_sales_for_user(user.id)
    return jsonify({"sales": [sale_data(sale) for sale in sales]})
