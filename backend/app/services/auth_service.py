from flask_jwt_extended import create_access_token

from ..errors import AuthenticationError, ConflictError, ValidationError
from ..extensions import db
from ..models import User
from .audit_service import record_error, record_information


def _required_text(data, field):
    value = data.get(field)
    if not isinstance(value, str) or not value.strip():
        raise ValidationError(f"{field} is required")
    return value.strip()


def register(data):
    email = _required_text(data, "email").lower()
    first_name = _required_text(data, "first_name")
    last_name = _required_text(data, "last_name")
    password = _required_text(data, "password")
    if len(password) < 8:
        raise ValidationError("password must contain at least 8 characters")
    if User.query.filter_by(email=email).first():
        raise ConflictError("email is already registered")

    user = User(email=email, first_name=first_name, last_name=last_name)
    user.set_password(password)
    db.session.add(user)
    db.session.flush()
    record_information("user_registration", "success", "User registered", user_id=user.id)
    db.session.commit()
    return user


def login(data):
    email = _required_text(data, "email").lower()
    password = _required_text(data, "password")
    user = User.query.filter_by(email=email).first()
    if not user or not user.check_password(password):
        record_error("login", "Invalid credentials")
        raise AuthenticationError("Invalid credentials")
    record_information("login", "success", "User authenticated", user_id=user.id)
    db.session.commit()
    return user, create_access_token(identity=str(user.id))


def get_authenticated_user(identity):
    try:
        user_id = int(identity)
    except (TypeError, ValueError):
        raise AuthenticationError("Unauthorized")
    user = db.session.get(User, user_id)
    if user is None:
        raise AuthenticationError("Unauthorized")
    return user


def change_password(identity, data):
    user = get_authenticated_user(identity)
    current_password = _required_text(data, "current_password")
    new_password = _required_text(data, "new_password")
    if len(new_password) < 8:
        raise ValidationError("new_password must contain at least 8 characters")
    if not user.check_password(current_password):
        record_error("change_password", "Current password did not match", user_id=user.id)
        raise AuthenticationError("Invalid current password")
    user.set_password(new_password)
    record_information("change_password", "success", "Password changed", user_id=user.id)
    db.session.commit()
    return user


def change_email(identity, data):
    user = get_authenticated_user(identity)

    current_password = _required_text(data, "current_password")
    new_email = _required_text(data, "new_email").lower()

    if not user.check_password(current_password):
        record_error("change_email", "Current password did not match", user_id=user.id)
        raise AuthenticationError("Invalid current password")

    existing_user = User.query.filter_by(email=new_email).first()
    if existing_user and existing_user.id != user.id:
        raise ConflictError("email is already registered")

    user.email = new_email

    record_information("change_email", "success", "Email changed", user_id=user.id)

    db.session.commit()

    return user