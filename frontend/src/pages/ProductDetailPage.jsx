import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import StatusPanel from '../components/StatusPanel.jsx';
import productCatalog from '../data/productCatalog.js';
import { formatPrice } from '../services/formatters.js';
import { getProduct } from '../services/productService.js';
import useCart from '../contexts/useCart.js';
import useToast from '../contexts/useToast.js';

function ProductDetailPage() {
  const { id } = useParams();
  const { addItem, openCart } = useCart();
  const { notify } = useToast();
  const [result, setResult] = useState({ id: null, product: null, error: '' });
  const [cartMessage, setCartMessage] = useState('');
  const [imageView, setImageView] = useState('main');

  useEffect(() => {
    let active = true;
    getProduct(id)
      .then((item) => {
        if (active) {
          setResult({ id, product: item, error: '' });
          setImageView('main');
        }
      })
      .catch(
        (requestError) =>
          active &&
          setResult({ id, product: null, error: requestError.message }),
      );
    return () => {
      active = false;
    };
  }, [id]);

  const loading = result.id !== id;
  const product = loading ? null : result.product;
  const error = loading ? '' : result.error;
  const productInfo = product ? productCatalog[product.id] : null;

  const detailImage =
    imageView === 'boxed' && productInfo?.boxedImage
      ? productInfo.boxedImage
      : product?.image;

  function handleAddToCart() {
    const addResult = addItem(product);
    setCartMessage(addResult.ok ? '' : addResult.message);
    if (addResult.ok) {
      notify(addResult.message);
      openCart();
    }
  }

  if (loading)
    return (
      <main className="container page-section">
        <StatusPanel type="loading">Cargando producto…</StatusPanel>
      </main>
    );

  if (error)
    return (
      <main className="container page-section">
        <StatusPanel
          type="error"
          title="No se pudo cargar el producto"
          action={
            <Link className="btn btn-outline-primary" to="/products">
              Volver al catálogo
            </Link>
          }
        >
          El producto que buscas no está disponible.
        </StatusPanel>
      </main>
    );

  if (!product) return null;

  return (
    <main className="container page-section">
      <nav aria-label="Migas de pan" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/products">Catálogo</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.model}
          </li>
        </ol>
      </nav>

      <div className="row g-4 g-lg-5 product-detail">
        <div className="col-lg-7">
          <div className="product-gallery">
            <div className="product-gallery-image">
              {detailImage ? (
                <img
                  src={detailImage}
                  alt={`${product.brand} ${product.model}`}
                  onError={(event) => {
                    event.currentTarget.hidden = true;
                  }}
                />
              ) : (
                <span className="detail-image-mark" aria-hidden="true">
                  CW
                </span>
              )}
            </div>

            <div className="product-gallery-controls" role="group">
              <button
                className={`product-gallery-button ${
                  imageView === 'main' ? 'is-active' : ''
                }`}
                type="button"
                onClick={() => setImageView('main')}
              >
                Principal
              </button>

              <button
                className={`product-gallery-button ${
                  imageView === 'boxed' ? 'is-active' : ''
                }`}
                type="button"
                onClick={() => setImageView('boxed')}
              >
                Caja
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <p className="eyebrow text-secondary">
            {product.brand} / {product.year}
          </p>

          <h1 className="page-title display-5">{product.model}</h1>

          <p className="detail-price">{formatPrice(product.price_eur)}</p>

          <p className="detail-availability">
            <span
              className={`availability-dot ${
                product.available ? 'is-available' : ''
              }`}
            />
            {product.available
              ? `Disponible · ${product.stock} en stock`
              : 'Sin stock actualmente'}
          </p>

          <p className="detail-copy">
            {productInfo?.description ||
              'Información del producto no disponible.'}
          </p>

          <button
            className="btn btn-primary btn-lg w-100"
            type="button"
            disabled={!product.available}
            onClick={handleAddToCart}
          >
            {product.available ? 'Añadir al carrito' : 'No disponible'}
          </button>

          {cartMessage && (
            <p className="small text-danger mt-2 mb-0" role="alert">
              {cartMessage}
            </p>
          )}

          <Link className="back-link d-inline-block mt-3" to="/products">
            ← Volver al catálogo
          </Link>
        </div>
      </div>
    </main>
  );
}

export default ProductDetailPage;
