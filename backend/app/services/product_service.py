from sqlalchemy import or_

from ..errors import NotFoundError
from ..extensions import db
from ..models import Product


def list_products(search=None):
    query = Product.query.order_by(Product.id.asc())
    if search:
        term = f"%{search.strip()}%"
        query = query.filter(or_(Product.brand.ilike(term), Product.model.ilike(term)))
    return query.all()


def get_product(product_id):
    product = db.session.get(Product, product_id)
    if product is None:
        raise NotFoundError("Product not found")
    return product
