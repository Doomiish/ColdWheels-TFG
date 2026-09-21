from ..models import Sale


def get_sales_for_user(user_id):
    return Sale.query.filter_by(user_id=user_id).order_by(Sale.created_at.desc()).all()
