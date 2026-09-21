import pytest

from app.extensions import db
from app.models import AuditError, AuditInformation, Product, Sale, SaleItem
from app.routes import sales as sales_route
from app.services import checkout_service

from .conftest import login, register


def guest_payload(currency="EUR", quantity=2):
    return {
        "currency": currency,
        "items": [{"product_id": 1, "quantity": quantity}],
        "guest": {
            "first_name": "Grace",
            "last_name": "Hopper",
            "address": "1 Compiler Street",
            "postal_code": "28001",
        },
        "payment": {"simulated_result": "approved", "card_number": "not-persisted"},
    }


def test_guest_checkout_calculates_eur_and_updates_stock(app, client):
    response = client.post("/api/checkout/guest", json=guest_payload())
    assert response.status_code == 201
    sale = response.json["sale"]
    assert sale["order_number"] == "CW-2026-000001"
    assert sale["currency"] == "EUR"
    assert sale["subtotal"] == "200.00"
    assert sale["tax"] == "42.00"
    assert sale["total"] == "242.00"
    assert sale["items"][0]["unit_price"] == "100.00"

    with app.app_context():
        assert db.session.get(Product, 1).stock == 3
        assert Sale.query.count() == 1
        assert SaleItem.query.count() == 1
        info = AuditInformation.query.one()
        assert info.sale_id == 1
        assert info.user_id is None


def test_guest_checkout_usd_and_required_guest_fields(client):
    usd = client.post("/api/checkout/guest", json=guest_payload("USD", 1))
    assert usd.status_code == 201
    assert usd.json["sale"]["exchange_rate"] == "1.1500"
    assert usd.json["sale"]["subtotal"] == "115.00"
    assert usd.json["sale"]["tax"] == "24.15"
    assert usd.json["sale"]["total"] == "139.15"

    missing_guest = guest_payload()
    del missing_guest["guest"]["postal_code"]
    assert client.post("/api/checkout/guest", json=missing_guest).status_code == 400

    rejected_payment = guest_payload()
    rejected_payment["payment"]["simulated_result"] = "declined"
    assert client.post("/api/checkout/guest", json=rejected_payment).status_code == 400


@pytest.mark.parametrize(
    "items",
    [
        None,
        [],
        ["not-an-object"],
        [{"product_id": "1", "quantity": 1}],
        [{"product_id": 1, "quantity": "1"}],
        [{"product_id": 1, "quantity": 0}],
        [{"product_id": 1, "quantity": -1}],
        [{"product_id": 1, "quantity": 1}, {"product_id": 1, "quantity": 1}],
    ],
)
def test_invalid_items_are_rejected_without_side_effects(app, client, items):
    payload = guest_payload()
    if items is None:
        del payload["items"]
    else:
        payload["items"] = items

    response = client.post("/api/checkout/guest", json=payload)
    assert response.status_code == 400
    with app.app_context():
        assert db.session.get(Product, 1).stock == 5
        assert Sale.query.count() == 0
        assert SaleItem.query.count() == 0


def test_unknown_product_and_invalid_currency_are_rejected_without_sale(app, client):
    unknown_product = guest_payload()
    unknown_product["items"] = [{"product_id": 999, "quantity": 1}]
    assert client.post("/api/checkout/guest", json=unknown_product).status_code == 404

    invalid_currency = guest_payload(currency="GBP")
    assert client.post("/api/checkout/guest", json=invalid_currency).status_code == 400
    with app.app_context():
        assert db.session.get(Product, 1).stock == 5
        assert Sale.query.count() == 0
        assert SaleItem.query.count() == 0


@pytest.mark.parametrize("field", ("first_name", "last_name", "address", "postal_code"))
def test_guest_checkout_requires_each_guest_field(client, field):
    payload = guest_payload()
    del payload["guest"][field]
    assert client.post("/api/checkout/guest", json=payload).status_code == 400


@pytest.mark.parametrize("guest", ({}, [], None))
def test_guest_checkout_rejects_empty_or_invalid_guest(client, guest):
    payload = guest_payload()
    payload["guest"] = guest
    assert client.post("/api/checkout/guest", json=payload).status_code == 400


@pytest.mark.parametrize(
    "payment",
    [
        None,
        "not-an-object",
        {},
        {"simulated_result": "declined"},
    ],
)
def test_simulated_payment_is_required_and_must_be_approved(app, client, payment):
    payload = guest_payload()
    if payment is None:
        del payload["payment"]
    else:
        payload["payment"] = payment

    response = client.post("/api/checkout/guest", json=payload)
    assert response.status_code == 400
    with app.app_context():
        assert Sale.query.count() == 0
        assert SaleItem.query.count() == 0


def test_exact_stock_quantity_is_allowed_and_stock_zero_cannot_be_bought(app, client):
    exact_stock = client.post("/api/checkout/guest", json=guest_payload(quantity=5))
    assert exact_stock.status_code == 201
    with app.app_context():
        assert db.session.get(Product, 1).stock == 0

    no_stock = guest_payload(quantity=1)
    no_stock["items"] = [{"product_id": 2, "quantity": 1}]
    assert client.post("/api/checkout/guest", json=no_stock).status_code == 400
    with app.app_context():
        assert Sale.query.count() == 1
        assert SaleItem.query.count() == 1


def test_authenticated_checkout_and_sales_history_excludes_guests(app, client):
    register(client)
    token = login(client).json["access_token"]
    client.post("/api/checkout/guest", json=guest_payload(quantity=1))
    authenticated = client.post(
        "/api/checkout/authenticated",
        headers={"Authorization": f"Bearer {token}"},
        json={
            "currency": "EUR",
            "items": [{"product_id": 1, "quantity": 1}],
            "payment": {"simulated_result": "approved"},
        },
    )
    assert authenticated.status_code == 201

    history = client.get("/api/sales/me", headers={"Authorization": f"Bearer {token}"})
    assert history.status_code == 200
    assert len(history.json["sales"]) == 1
    assert history.json["sales"][0]["items"][0]["brand"] == "ColdWheels"
    assert history.json["sales"][0]["items"][0]["unit_price"] == "100.00"
    with app.app_context():
        assert Sale.query.filter_by(user_id=None).count() == 1


def test_sales_are_isolated_between_users(client):
    register(client, email="one@example.com")
    first_token = login(client, email="one@example.com").json["access_token"]
    register(client, email="two@example.com")
    second_token = login(client, email="two@example.com").json["access_token"]
    checkout_response = client.post(
        "/api/checkout/authenticated",
        headers={"Authorization": f"Bearer {first_token}"},
        json={
            "items": [{"product_id": 1, "quantity": 1}],
            "payment": {"simulated_result": "approved"},
        },
    )
    assert checkout_response.status_code == 201
    response = client.get("/api/sales/me", headers={"Authorization": f"Bearer {second_token}"})
    assert response.json["sales"] == []


def test_sales_history_requires_jwt_and_is_empty_for_new_user(client):
    assert client.get("/api/sales/me").status_code == 401
    register(client)
    token = login(client).json["access_token"]
    response = client.get("/api/sales/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json["sales"] == []


def test_sales_history_route_delegates_to_sales_service(client, monkeypatch):
    register(client)
    token = login(client).json["access_token"]
    received_user_ids = []

    def get_sales_for_user(user_id):
        received_user_ids.append(user_id)
        return []

    monkeypatch.setattr(sales_route, "get_sales_for_user", get_sales_for_user)
    response = client.get("/api/sales/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 200
    assert response.json["sales"] == []
    assert received_user_ids == [1]


def test_authenticated_checkout_requires_jwt_and_uses_token_identity(app, client):
    payload = {"currency": "EUR", "items": [{"product_id": 1, "quantity": 1}], "payment": {"simulated_result": "approved"}}
    assert client.post("/api/checkout/authenticated", json=payload).status_code == 401
    assert client.post(
        "/api/checkout/authenticated",
        headers={"Authorization": "Bearer malformed"},
        json=payload,
    ).status_code == 401

    register(client)
    token = login(client).json["access_token"]
    payload["user_id"] = 999
    response = client.post(
        "/api/checkout/authenticated",
        headers={"Authorization": f"Bearer {token}"},
        json=payload,
    )
    assert response.status_code == 201
    with app.app_context():
        assert Sale.query.one().user_id == 1


def test_sale_item_keeps_a_historical_product_snapshot(app, client):
    response = client.post("/api/checkout/guest", json=guest_payload(quantity=1))
    snapshot = response.json["sale"]["items"][0]
    with app.app_context():
        product = db.session.get(Product, 1)
        product.brand = "Changed brand"
        product.model = "Changed model"
        product.price_eur = "999.99"
        db.session.commit()
        stored_item = SaleItem.query.one()
        assert stored_item.brand == snapshot["brand"] == "ColdWheels"
        assert stored_item.model == snapshot["model"] == "Arctic 700"
        assert str(stored_item.unit_price) == "100.00"


def test_insufficient_stock_creates_no_sale_and_records_safe_error(app, client):
    response = client.post("/api/checkout/guest", json=guest_payload(quantity=6))
    assert response.status_code == 400
    with app.app_context():
        assert db.session.get(Product, 1).stock == 5
        assert Sale.query.count() == 0
        assert AuditError.query.count() == 1


def test_audit_failure_rolls_back_sale_items_and_stock(app, client, monkeypatch):
    def fail_audit(*_args, **_kwargs):
        raise RuntimeError("audit store unavailable")

    monkeypatch.setattr(checkout_service, "record_information", fail_audit)
    response = client.post("/api/checkout/guest", json=guest_payload(quantity=1))
    assert response.status_code == 500
    with app.app_context():
        assert Sale.query.count() == 0
        assert SaleItem.query.count() == 0
        assert db.session.get(Product, 1).stock == 5
        assert AuditInformation.query.count() == 0
