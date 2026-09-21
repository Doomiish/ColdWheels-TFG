from datetime import timedelta

from flask_jwt_extended import create_access_token

from .conftest import login, register


def test_register_login_and_profile(client):
    registration = register(client)
    assert registration.status_code == 201
    assert registration.json["user"]["email"] == "driver@example.com"

    login_response = login(client)
    assert login_response.status_code == 200
    token = login_response.json["access_token"]

    profile = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert profile.status_code == 200
    assert profile.json["user"]["first_name"] == "Ada"


def test_invalid_credentials_and_protected_endpoint(client):
    register(client)
    assert login(client, password="wrong-password").status_code == 401
    assert client.get("/api/auth/me").status_code == 401
    assert client.get("/api/auth/me", headers={"Authorization": "Bearer malformed"}).status_code == 401


def test_duplicate_registration_and_short_password_are_rejected(client):
    assert register(client).status_code == 201
    assert register(client).status_code == 409
    assert register(client, email="short@example.com", password="short").status_code == 400


def test_expired_jwt_is_rejected(app, client):
    with app.app_context():
        token = create_access_token(identity="1", expires_delta=timedelta(seconds=-1))
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_valid_jwt_for_nonexistent_user_is_rejected(app, client):
    with app.app_context():
        token = create_access_token(identity="999")
    response = client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert response.status_code == 401


def test_change_password(client):
    register(client)
    token = login(client).json["access_token"]
    response = client.patch(
        "/api/auth/change-password",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "safe-password", "new_password": "new-safe-password"},
    )
    assert response.status_code == 200
    assert login(client, password="new-safe-password").status_code == 200


def test_change_password_rejects_wrong_current_and_short_new_password(client):
    register(client)
    token = login(client).json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    wrong_current = client.patch(
        "/api/auth/change-password",
        headers=headers,
        json={"current_password": "wrong-password", "new_password": "new-safe-password"},
    )
    assert wrong_current.status_code == 401

    short_new = client.patch(
        "/api/auth/change-password",
        headers=headers,
        json={"current_password": "safe-password", "new_password": "short"},
    )
    assert short_new.status_code == 400
