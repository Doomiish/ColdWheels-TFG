from decimal import Decimal

from app import create_app
from app.extensions import db
from app.models import Product


PRODUCTS = [
    {
        "id": 1,
        "brand": "Porsche",
        "model": "911 GT3 R (992)",
        "year": 2022,
        "image": "/img/racing/porsche-911-gt3-r.png",
        "price_eur": Decimal("9.99"),
        "stock": 7,
    },
    {
        "id": 2,
        "brand": "BMW",
        "model": "M3 E30",
        "year": 1986,
        "image": "/img/racing/bmw-m3-e30.png",
        "price_eur": Decimal("9.99"),
        "stock": 8,
    },
    {
        "id": 3,
        "brand": "Subaru",
        "model": "Impreza WRX STI GDB",
        "year": 2000,
        "image": "/img/racing/subaru-impreza-wrx-sti-gdb.png",
        "price_eur": Decimal("9.99"),
        "stock": 6,
    },
    {
        "id": 4,
        "brand": "Lancia",
        "model": "Delta HF Integrale 8V Nº2",
        "year": 1987,
        "image": "/img/racing/lancia-delta-hf-integrale-8v.png",
        "price_eur": Decimal("12.99"),
        "stock": 3,
    },
    {
        "id": 5,
        "brand": "Ferrari",
        "model": "F40 Spider",
        "year": 1987,
        "image": "/img/supercars/ferrari-f40-spider.png",
        "price_eur": Decimal("12.99"),
        "stock": 3,
    },
    {
        "id": 6,
        "brand": "Lamborghini",
        "model": "Countach 5000 QV",
        "year": 1985,
        "image": "/img/supercars/lamborghini-countach-5000-qv.png",
        "price_eur": Decimal("9.99"),
        "stock": 6,
    },
    {
        "id": 7,
        "brand": "McLaren",
        "model": "F1 GTR Nº50 Jacadi",
        "year": 1995,
        "image": "/img/supercars/mclaren-f1-gtr-50-jacadi.png",
        "price_eur": Decimal("12.99"),
        "stock": 2,
    },
    {
        "id": 8,
        "brand": "Porsche",
        "model": "918 Spyder",
        "year": 2013,
        "image": "/img/supercars/porsche-918-spyder.png",
        "price_eur": Decimal("9.99"),
        "stock": 7,
    },
    {
        "id": 9,
        "brand": "Volkswagen",
        "model": "Fox Mk1",
        "year": 2003,
        "image": "/img/street-tuning/volkswagen-fox-mk1.png",
        "price_eur": Decimal("12.99"),
        "stock": 4,
    },
    {
        "id": 10,
        "brand": "Nissan",
        "model": "Silvia S15",
        "year": 1999,
        "image": "/img/street-tuning/nissan-silvia-s15.png",
        "price_eur": Decimal("9.99"),
        "stock": 7,
    },
    {
        "id": 11,
        "brand": "Honda",
        "model": "Civic Type R EK9",
        "year": 1997,
        "image": "/img/street-tuning/honda-civic-type-r-ek9.png",
        "price_eur": Decimal("9.99"),
        "stock": 8,
    },
    {
        "id": 12,
        "brand": "Mazda",
        "model": "RX-7 FD",
        "year": 1991,
        "image": "/img/street-tuning/mazda-rx-7-fd.png",
        "price_eur": Decimal("9.99"),
        "stock": 6,
    },
    {
        "id": 13,
        "brand": "Ford",
        "model": "Mustang Fastback 1967",
        "year": 1967,
        "image": "/img/classics/ford-mustang-fastback.png",
        "price_eur": Decimal("9.99"),
        "stock": 8,
    },
    {
        "id": 14,
        "brand": "Chevrolet",
        "model": "Camaro SS 1969",
        "year": 1969,
        "image": "/img/classics/chevrolet-camaro-ss.png",
        "price_eur": Decimal("9.99"),
        "stock": 7,
    },
    {
        "id": 15,
        "brand": "Volkswagen",
        "model": "Golf GTI Mk1",
        "year": 1976,
        "image": "/img/classics/volkswagen-golf-gti-mk1.png",
        "price_eur": Decimal("7.99"),
        "stock": 11,
    },
    {
        "id": 16,
        "brand": "BMW",
        "model": "2002",
        "year": 1968,
        "image": "/img/classics/bmw-2002.png",
        "price_eur": Decimal("7.99"),
        "stock": 10,
    },
    {
        "id": 17,
        "brand": "Toyota",
        "model": "Land Cruiser FJ40",
        "year": 1960,
        "image": "/img/off-road/toyota-fj40.png",
        "price_eur": Decimal("9.99"),
        "stock": 7,
    },
    {
        "id": 18,
        "brand": "Jeep",
        "model": "Wrangler Rubicon TJ",
        "year": 2003,
        "image": "/img/off-road/jeep-wrangler-rubicon.png",
        "price_eur": Decimal("9.99"),
        "stock": 8,
    },
    {
        "id": 19,
        "brand": "Ford",
        "model": "Bronco 1970",
        "year": 1970,
        "image": "/img/off-road/ford-bronco.png",
        "price_eur": Decimal("9.99"),
        "stock": 6,
    },
    {
        "id": 20,
        "brand": "Ford",
        "model": "F-150 Raptor 2025",
        "year": 2025,
        "image": "/img/off-road/ford-f-150-raptor-2025.png",
        "price_eur": Decimal("12.99"),
        "stock": 3,
    },
]


def seed_products():
    app = create_app()

    with app.app_context():
        for data in PRODUCTS:
            product = db.session.get(Product, data["id"])

            if product is None:
                product = Product(id=data["id"])
                db.session.add(product)

            product.brand = data["brand"]
            product.model = data["model"]
            product.year = data["year"]
            product.image = data["image"]
            product.price_eur = data["price_eur"]
            product.stock = data["stock"]

        db.session.commit()

        print(f"Productos cargados: {len(PRODUCTS)}")


if __name__ == "__main__":
    seed_products()