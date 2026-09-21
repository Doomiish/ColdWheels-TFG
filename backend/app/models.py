from datetime import datetime, timezone

from werkzeug.security import check_password_hash, generate_password_hash

from .extensions import db


def utcnow():
    return datetime.now(timezone.utc)


class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(255), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    sales = db.relationship("Sale", back_populates="user")

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)


class Product(db.Model):
    __tablename__ = "products"

    id = db.Column(db.Integer, primary_key=True)
    brand = db.Column(db.String(100), nullable=False, index=True)
    model = db.Column(db.String(150), nullable=False, index=True)
    year = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    price_eur = db.Column(db.Numeric(12, 2), nullable=False)
    stock = db.Column(db.Integer, nullable=False, default=0)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    sale_items = db.relationship("SaleItem", back_populates="product")


class Sale(db.Model):
    __tablename__ = "sales"

    id = db.Column(db.Integer, primary_key=True)
    order_number = db.Column(db.String(20), unique=True, nullable=False, index=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    guest_first_name = db.Column(db.String(100), nullable=True)
    guest_last_name = db.Column(db.String(100), nullable=True)
    guest_address = db.Column(db.String(255), nullable=True)
    guest_postal_code = db.Column(db.String(20), nullable=True)
    currency = db.Column(db.String(3), nullable=False)
    exchange_rate = db.Column(db.Numeric(8, 4), nullable=False)
    subtotal = db.Column(db.Numeric(12, 2), nullable=False)
    tax = db.Column(db.Numeric(12, 2), nullable=False)
    total = db.Column(db.Numeric(12, 2), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow, index=True)
    user = db.relationship("User", back_populates="sales")
    items = db.relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")
    audit_information = db.relationship("AuditInformation", back_populates="sale")
    audit_errors = db.relationship("AuditError", back_populates="sale")


class SaleItem(db.Model):
    __tablename__ = "sale_items"

    id = db.Column(db.Integer, primary_key=True)
    sale_id = db.Column(db.Integer, db.ForeignKey("sales.id"), nullable=False, index=True)
    product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=False)
    brand = db.Column(db.String(100), nullable=False)
    model = db.Column(db.String(150), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    image = db.Column(db.String(500), nullable=True)
    quantity = db.Column(db.Integer, nullable=False)
    unit_price = db.Column(db.Numeric(12, 2), nullable=False)
    subtotal = db.Column(db.Numeric(12, 2), nullable=False)
    tax = db.Column(db.Numeric(12, 2), nullable=False)
    total = db.Column(db.Numeric(12, 2), nullable=False)
    sale = db.relationship("Sale", back_populates="items")
    product = db.relationship("Product", back_populates="sale_items")


class AuditInformation(db.Model):
    __tablename__ = "audit_information"

    id = db.Column(db.Integer, primary_key=True)
    operation = db.Column(db.String(100), nullable=False)
    result = db.Column(db.String(50), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    sale_id = db.Column(db.Integer, db.ForeignKey("sales.id"), nullable=True, index=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    user = db.relationship("User")
    sale = db.relationship("Sale", back_populates="audit_information")


class AuditError(db.Model):
    __tablename__ = "audit_errors"

    id = db.Column(db.Integer, primary_key=True)
    operation = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(500), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True, index=True)
    sale_id = db.Column(db.Integer, db.ForeignKey("sales.id"), nullable=True, index=True)
    created_at = db.Column(db.DateTime(timezone=True), nullable=False, default=utcnow)
    user = db.relationship("User")
    sale = db.relationship("Sale", back_populates="audit_errors")
