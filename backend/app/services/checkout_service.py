from decimal import Decimal

from ..errors import NotFoundError, ValidationError
from ..extensions import db
from ..models import Product, Sale, SaleItem
from ..money import EXCHANGE_RATES, TAX_RATE, convert_eur, gross_to_net, money
from .audit_service import record_error, record_information
from .auth_service import get_authenticated_user


def _validate_items(data):
    items = data.get("items")
    if not isinstance(items, list) or not items:
        raise ValidationError("items must be a non-empty list")
    validated = []
    seen_ids = set()
    for item in items:
        if not isinstance(item, dict):
            raise ValidationError("Each item must be an object")
        product_id, quantity = item.get("product_id"), item.get("quantity")
        if isinstance(product_id, bool) or not isinstance(product_id, int) or product_id < 1:
            raise ValidationError("product_id must be a positive integer")
        if isinstance(quantity, bool) or not isinstance(quantity, int) or quantity < 1:
            raise ValidationError("quantity must be a positive integer")
        if product_id in seen_ids:
            raise ValidationError("Duplicate product_id values are not allowed")
        seen_ids.add(product_id)
        validated.append((product_id, quantity))
    return validated


def _currency(data):
    currency = data.get("currency", "EUR")
    if not isinstance(currency, str):
        raise ValidationError("currency must be EUR or USD")
    currency = currency.upper()
    if currency not in EXCHANGE_RATES:
        raise ValidationError("currency must be EUR or USD")
    return currency


def _guest_data(data):
    guest = data.get("guest")
    if not isinstance(guest, dict):
        raise ValidationError("guest information is required")
    required = ("first_name", "last_name", "address", "postal_code")
    result = {}
    for field in required:
        value = guest.get(field)
        if not isinstance(value, str) or not value.strip():
            raise ValidationError(f"guest.{field} is required")
        result[field] = value.strip()
    return result


def _validate_simulated_payment(data):
    """Accept only an approved simulated payment and never persist payment data."""
    payment = data.get("payment")
    if not isinstance(payment, dict):
        raise ValidationError("payment is required and must be an object")
    result = payment.get("simulated_result")
    if result != "approved":
        raise ValidationError("Simulated payment was not approved")


def checkout(data, authenticated_identity=None):
    if not isinstance(data, dict):
        raise ValidationError("A JSON object is required")
    items = _validate_items(data)
    currency = _currency(data)
    _validate_simulated_payment(data)
    guest = _guest_data(data) if authenticated_identity is None else None
    user_id = None

    try:
        # A request must not inherit a read transaction from prior work.
        # Checkout itself always starts one explicit, all-or-nothing transaction.
        if db.session().in_transaction():
            db.session.rollback()
        with db.session.begin():
            if authenticated_identity is not None:
                user_id = get_authenticated_user(authenticated_identity).id

            sale = Sale(
                order_number="PENDING",
                user_id=user_id,
                currency=currency,
                exchange_rate=EXCHANGE_RATES[currency],
                subtotal=Decimal("0.00"),
                tax=Decimal("0.00"),
                total=Decimal("0.00"),
                guest_first_name=guest["first_name"] if guest else None,
                guest_last_name=guest["last_name"] if guest else None,
                guest_address=guest["address"] if guest else None,
                guest_postal_code=guest["postal_code"] if guest else None,
            )
            db.session.add(sale)
            db.session.flush()
            sale.order_number = f"CW-{sale.created_at.year}-{sale.id:06d}"

            subtotal = Decimal("0.00")
            tax = Decimal("0.00")
            total = Decimal("0.00")
            for product_id, quantity in items:
                product = db.session.get(Product, product_id)
                if product is None:
                    raise NotFoundError(f"Product {product_id} not found")
                if product.stock < quantity:
                    raise ValidationError(f"Insufficient stock for product {product_id}")

                unit_gross = convert_eur(product.price_eur, currency)
                unit_net = gross_to_net(unit_gross)
                item_subtotal = money(unit_net * quantity)
                item_tax = money(item_subtotal * TAX_RATE)
                item_total = money(item_subtotal + item_tax)
                sale.items.append(
                    SaleItem(
                        product_id=product.id,
                        brand=product.brand,
                        model=product.model,
                        year=product.year,
                        image=product.image,
                        quantity=quantity,
                        unit_price=unit_net,
                        subtotal=item_subtotal,
                        tax=item_tax,
                        total=item_total,
                    )
                )
                product.stock -= quantity
                subtotal += item_subtotal
                tax += item_tax
                total += item_total

            sale.subtotal = money(subtotal)
            sale.tax = money(tax)
            sale.total = money(total)
            record_information(
                "checkout",
                "success",
                "Checkout completed",
                user_id=user_id,
                sale_id=sale.id,
            )
            db.session.flush()
            sale_id = sale.id
    except Exception as error:
        # Error auditing is intentionally separate: it cannot turn a rollback into a commit.
        if isinstance(error, (ValidationError, NotFoundError)):
            record_error("checkout", str(error), user_id=user_id)
        raise

    return db.session.get(Sale, sale_id)
