def test_list_search_and_detail(client):
    listing = client.get("/api/products")
    assert listing.status_code == 200
    assert len(listing.json["products"]) == 2

    search = client.get("/api/products?search=arctic")
    assert [product["model"] for product in search.json["products"]] == ["Arctic 700"]

    detail = client.get("/api/products/2")
    assert detail.status_code == 200
    assert detail.json["product"]["available"] is False
    assert detail.json["product"]["stock"] == 0


def test_unknown_product_returns_404(client):
    response = client.get("/api/products/999")
    assert response.status_code == 404
