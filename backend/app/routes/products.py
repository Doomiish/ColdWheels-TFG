from flask import Blueprint, jsonify, request

from ..serializers import product_data
from ..services import product_service

products_bp = Blueprint("products", __name__)


@products_bp.get("")
@products_bp.get("/")
def list_products():
    search = request.args.get("search")
    return jsonify({"products": [product_data(p) for p in product_service.list_products(search)]})


@products_bp.get("/<int:product_id>")
def product_detail(product_id):
    return jsonify({"product": product_data(product_service.get_product(product_id))})
