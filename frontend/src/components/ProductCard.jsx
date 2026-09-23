import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../services/formatters.js';
import useCart from '../contexts/useCart.js';
import useToast from '../contexts/useToast.js';

function ProductCard({ product }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [message, setMessage] = useState('');
  const { addItem, openCart } = useCart();
  const { notify } = useToast();
  const canBuy = product.available && product.stock > 0;

  function handleAdd() {
    const result = addItem(product);
    setMessage(result.ok ? '' : result.message);
    if (result.ok) {
      notify(result.message);
      openCart();
    }
  }

  return (
    <article className="card product-card h-100">
      <Link
        className="product-image-link"
        to={`/products/${product.id}`}
        aria-label={`Ver ${product.brand} ${product.model}`}
      >
        <div className="product-image-wrap">
          {product.image && !imageFailed ? (
            <img
              className="product-image"
              src={product.image}
              alt={`${product.brand} ${product.model}`}
              loading="lazy"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="product-image-fallback" aria-hidden="true">
              <span>{product.brand?.slice(0, 1) || 'C'}</span>
              <small>ROAD / {product.year}</small>
            </div>
          )}
          <span className={`stock-badge ${canBuy ? 'in-stock' : 'out-stock'}`}>
            {canBuy ? 'Disponible' : 'Agotado'}
          </span>
        </div>
      </Link>
      <div className="card-body d-flex flex-column p-3 p-lg-4">
        <p className="product-brand mb-1">{product.brand}</p>
        <h2 className="h5 product-name">{product.model}</h2>
        <p className="product-year">Año {product.year}</p>
        <div className="mt-auto d-flex align-items-center justify-content-between gap-2 pt-3">
          <strong className="product-price">
            {formatPrice(product.price_eur)}
          </strong>
          <Link
            className="btn btn-outline-primary btn-sm"
            to={`/products/${product.id}`}
          >
            Ver producto
          </Link>
        </div>
        {canBuy && (
          <button
            className="btn btn-primary mt-3"
            type="button"
            onClick={handleAdd}
          >
            Añadir al carrito
          </button>
        )}
        {message && (
          <p className="small text-danger mt-2 mb-0" role="alert">
            {message}
          </p>
        )}
      </div>
    </article>
  );
}

export default ProductCard;
