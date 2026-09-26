import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import productCatalog from '../data/productCatalog.js';
import { getProducts } from '../services/productService.js';

const categories = [
  'Todas',
  'Racing',
  'Supercars',
  'Street / Tuning',
  'Classics',
  'Off-Road / Utility',
];

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categoryParam = searchParams.get('category');
  const selectedCategory = categories.includes(categoryParam)
    ? categoryParam
    : 'Todas';

  useEffect(() => {
    let active = true;
    getProducts()
      .then((items) => active && setProducts(items))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  const filteredProducts =
    selectedCategory === 'Todas'
      ? products
      : products.filter(
          (product) =>
            productCatalog[product.id]?.category === selectedCategory,
        );

  return (
    <main className="container page-section">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow text-secondary">COLDWHEELS / SELECCIÓN</p>
          <h1 className="page-title">Catálogo</h1>
        </div>
        {!loading && !error && (
          <span className="catalog-count">
            {filteredProducts.length} productos
          </span>
        )}
      </div>

      {!loading && !error && products.length > 0 && (
        <div>
          <p className="catalog-filter-label">Categorías</p>
          <div className="catalog-filters" aria-label="Filtrar por categoría">
            {categories.map((category) => (
              <button
                className={`catalog-filter ${
                  selectedCategory === category ? 'is-active' : ''
                }`}
                key={category}
                type="button"
                onClick={() => {
                  if (category === 'Todas') {
                    setSearchParams({});
                    return;
                  }

                  setSearchParams({ category });
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && (
        <StatusPanel type="loading" title="Cargando catálogo">
          Estamos consultando el inventario.
        </StatusPanel>
      )}

      {error && (
        <StatusPanel type="error" title="No se pudo cargar el catálogo">
          {error}
        </StatusPanel>
      )}

      {!loading && !error && products.length === 0 && (
        <StatusPanel title="Aún no hay productos">
          Vuelve a consultar el catálogo más tarde.
        </StatusPanel>
      )}

      {!loading &&
        !error &&
        products.length > 0 &&
        filteredProducts.length === 0 && (
          <StatusPanel title="No hay productos en esta categoría">
            Selecciona otra categoría para seguir explorando la colección.
          </StatusPanel>
        )}

      {!loading && !error && filteredProducts.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
          {filteredProducts.map((product) => (
            <div className="col" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default ProductsPage;
