from decimal import Decimal, ROUND_HALF_UP

CENT = Decimal("0.01")
TAX_RATE = Decimal("0.21")
EXCHANGE_RATES = {"EUR": Decimal("1.00"), "USD": Decimal("1.15")}


def money(value):
    return Decimal(str(value)).quantize(CENT, rounding=ROUND_HALF_UP)


def convert_eur(amount, currency):
    return money(Decimal(str(amount)) * EXCHANGE_RATES[currency])


def gross_to_net(gross):
    return money(Decimal(str(gross)) / (Decimal("1.00") + TAX_RATE))
