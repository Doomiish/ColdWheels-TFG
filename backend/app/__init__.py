import os

from flask import Flask, jsonify

from .config import Config
from .errors import ApiError
from .extensions import db, jwt, migrate


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.from_object(Config)
    if test_config:
        app.config.update(test_config)

    if not app.config.get("JWT_SECRET_KEY"):
        if app.config.get("TESTING"):
            app.config["JWT_SECRET_KEY"] = "test-only-secret"
        else:
            raise RuntimeError("JWT_SECRET_KEY environment variable is required")

    os.makedirs(app.instance_path, exist_ok=True)
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    from .routes.auth import auth_bp
    from .routes.checkout import checkout_bp
    from .routes.products import products_bp
    from .routes.sales import sales_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(checkout_bp, url_prefix="/api/checkout")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")

    @app.errorhandler(ApiError)
    def handle_api_error(error):
        return jsonify({"error": error.message}), error.status_code

    @app.errorhandler(400)
    def handle_bad_request(_error):
        return jsonify({"error": "Invalid request"}), 400

    @app.errorhandler(500)
    def handle_server_error(_error):
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500

    @jwt.unauthorized_loader
    def jwt_missing(_reason):
        return jsonify({"error": "Unauthorized"}), 401

    @jwt.invalid_token_loader
    def jwt_invalid(_reason):
        return jsonify({"error": "Unauthorized"}), 401

    @jwt.expired_token_loader
    def jwt_expired(_header, _payload):
        return jsonify({"error": "Unauthorized"}), 401

    return app
