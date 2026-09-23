import { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard.jsx';
import StatusPanel from '../components/StatusPanel.jsx';
import { getProducts } from '../services/productService.js';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <main className="container page-section">
      <div className="catalog-heading">
        <div>
          <p className="eyebrow text-secondary">COLDWHEELS / SELECCIÓN</p>
          <h1 className="page-title">Catálogo</h1>
        </div>
        {!loading && !error && (
          <span className="catalog-count">{products.length} productos</span>
        )}
      </div>
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
      {!loading && !error && products.length > 0 && (
        <div className="row row-cols-1 row-cols-sm-2 row-cols-xl-4 g-4">
          {products.map((product) => (
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
