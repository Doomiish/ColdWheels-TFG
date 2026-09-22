from datetime import timedelta

from flask_jwt_extended import create_access_token

from app.extensions import db
from app.models import AuditInformation, User

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


def test_change_email_updates_email_and_requires_current_password(client):
    register(client)
    token = login(client).json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    response = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "safe-password", "new_email": " New@Example.com "},
    )

    assert response.status_code == 200
    assert response.json["user"]["email"] == "new@example.com"
    assert login(client, email="new@example.com").status_code == 200
    assert login(client, email="driver@example.com").status_code == 401


def test_change_email_rejects_duplicate_email_and_wrong_password(client):
    register(client, email="one@example.com")
    first_token = login(client, email="one@example.com").json["access_token"]
    register(client, email="two@example.com")
    headers = {"Authorization": f"Bearer {first_token}"}

    duplicate = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "safe-password", "new_email": "two@example.com"},
    )
    wrong_password = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "wrong-password", "new_email": "new@example.com"},
    )

    assert duplicate.status_code == 409
    assert duplicate.json == {"error": "email is already registered"}
    assert wrong_password.status_code == 401


def test_change_email_requires_jwt_and_new_email(client):
    assert client.patch("/api/auth/change-email", json={}).status_code == 401

    register(client)
    token = login(client).json["access_token"]
    response = client.patch(
        "/api/auth/change-email",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "safe-password"},
    )

    assert response.status_code == 400


def test_change_email_rejects_missing_and_empty_fields(client):
    register(client)
    token = login(client).json["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    missing_current_password = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"new_email": "new@example.com"},
    )
    empty_current_password = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "", "new_email": "new@example.com"},
    )
    missing_new_email = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "safe-password"},
    )
    empty_new_email = client.patch(
        "/api/auth/change-email",
        headers=headers,
        json={"current_password": "safe-password", "new_email": ""},
    )

    assert missing_current_password.status_code == 400
    assert empty_current_password.status_code == 400
    assert missing_new_email.status_code == 400
    assert empty_new_email.status_code == 400


def test_change_email_preserves_password_hash_and_other_users(client, app):
    register(client, email="one@example.com")
    token = login(client, email="one@example.com").json["access_token"]
    register(client, email="two@example.com")

    with app.app_context():
        first_user = User.query.filter_by(email="one@example.com").one()
        second_user = User.query.filter_by(email="two@example.com").one()
        original_password_hash = first_user.password_hash
        original_second_user = {
            "email": second_user.email,
            "password_hash": second_user.password_hash,
            "first_name": second_user.first_name,
            "last_name": second_user.last_name,
        }

    response = client.patch(
        "/api/auth/change-email",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "safe-password", "new_email": "  ONE@NEW.EXAMPLE  "},
    )

    assert response.status_code == 200
    with app.app_context():
        updated_user = db.session.get(User, first_user.id)
        unchanged_user = db.session.get(User, second_user.id)
        assert updated_user.email == "one@new.example"
        assert updated_user.password_hash == original_password_hash
        assert {
            "email": unchanged_user.email,
            "password_hash": unchanged_user.password_hash,
            "first_name": unchanged_user.first_name,
            "last_name": unchanged_user.last_name,
        } == original_second_user


def test_change_email_success_creates_safe_audit_information(client, app):
    register(client)
    token = login(client).json["access_token"]

    response = client.patch(
        "/api/auth/change-email",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "safe-password", "new_email": "new@example.com"},
    )

    assert response.status_code == 200
    with app.app_context():
        audit = AuditInformation.query.filter_by(operation="change_email").one()
        assert audit.result == "success"
        assert audit.user_id == 1
        assert audit.description == "Email changed"
        for sensitive_value in ("safe-password", token, "secret", "password", "jwt"):
            assert sensitive_value.lower() not in audit.description.lower()


def test_change_email_with_valid_jwt_for_nonexistent_user_returns_401(app, client):
    with app.app_context():
        token = create_access_token(identity="999")

    response = client.patch(
        "/api/auth/change-email",
        headers={"Authorization": f"Bearer {token}"},
        json={"current_password": "safe-password", "new_email": "new@example.com"},
    )

    assert response.status_code == 401
