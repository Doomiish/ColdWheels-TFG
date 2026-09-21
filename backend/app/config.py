import os
from datetime import timedelta
from pathlib import Path


BASE_DIR = Path(__file__).resolve().parents[1]


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL", f"sqlite:///{BASE_DIR / 'instance' / 'coldwheels.sqlite3'}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    TAX_RATE = "0.21"
    USD_EXCHANGE_RATE = "1.15"
