import pytest

from app import create_app
from app.extensions import db
from app.models import Product


@pytest.fixture()
def app():
    app = create_app(
        {
            "TESTING": True,
            "PROPAGATE_EXCEPTIONS": False,
            "SQLALCHEMY_DATABASE_URI": "sqlite://",
            "JWT_SECRET_KEY": "test-secret-that-is-at-least-thirty-two-bytes",
        }
    )
    with app.app_context():
        db.create_all()
        product = Product(
            brand="ColdWheels",
            model="Arctic 700",
            year=2026,
            image="/images/arctic-700.jpg",
            price_eur="121.00",
            stock=5,
        )
        empty_product = Product(
            brand="ColdWheels",
            model="Ice 300",
            year=2025,
            image=None,
            price_eur="60.50",
            stock=0,
        )
        db.session.add_all([product, empty_product])
        db.session.commit()
        yield app
        db.session.remove()
        db.drop_all()


@pytest.fixture()
def client(app):
    return app.test_client()


def register(client, email="driver@example.com", password="safe-password"):
    response = client.post(
        "/api/auth/register",
        json={
            "email": email,
            "password": password,
            "first_name": "Ada",
            "last_name": "Lovelace",
        },
    )
    return response


def login(client, email="driver@example.com", password="safe-password"):
    return client.post("/api/auth/login", json={"email": email, "password": password})
