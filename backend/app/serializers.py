from datetime import timezone


def decimal_string(value):
    return format(value, ".2f")


def iso_timestamp(value):
    if value.tzinfo is None:
        value = value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc).isoformat().replace("+00:00", "Z")


def product_data(product):
    return {
        "id": product.id,
        "brand": product.brand,
        "model": product.model,
        "year": product.year,
        "image": product.image,
        "price_eur": decimal_string(product.price_eur),
        "stock": product.stock,
        "available": product.stock > 0,
    }


def user_data(user):
    return {
        "id": user.id,
        "email": user.email,
        "first_name": user.first_name,
        "last_name": user.last_name,
        "created_at": iso_timestamp(user.created_at),
    }


def sale_item_data(item):
    return {
        "id": item.id,
        "product_id": item.product_id,
        "brand": item.brand,
        "model": item.model,
        "year": item.year,
        "image": item.image,
        "quantity": item.quantity,
        "unit_price": decimal_string(item.unit_price),
        "subtotal": decimal_string(item.subtotal),
        "tax": decimal_string(item.tax),
        "total": decimal_string(item.total),
    }


def sale_data(sale):
    return {
        "id": sale.id,
        "order_number": sale.order_number,
        "currency": sale.currency,
        "exchange_rate": format(sale.exchange_rate, ".4f"),
        "subtotal": decimal_string(sale.subtotal),
        "tax": decimal_string(sale.tax),
        "total": decimal_string(sale.total),
        "created_at": iso_timestamp(sale.created_at),
        "items": [sale_item_data(item) for item in sale.items],
    }
