import { Link } from 'react-router-dom';
import { formatPrice } from '../services/formatters.js';
import useCart from '../contexts/useCart.js';
import useToast from '../contexts/useToast.js';

function CartLine({ item, compact = false }) {
  const { removeItem, updateQuantity } = useCart();
  const { notify } = useToast();
  const subtotal = Number(item.price_eur) * item.quantity;

  return (
    <article className={`cart-line${compact ? ' cart-line-compact' : ''}`}>
      <Link
        className="cart-line-art"
        to={`/products/${item.product_id}`}
        aria-label={`Ver ${item.brand} ${item.model}`}
      >
        {item.image ? (
          <img
            src={item.image}
            alt=""
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : null}
        <span aria-hidden="true">CW</span>
      </Link>
      <div className="cart-line-info">
        <p className="product-brand mb-1">{item.brand}</p>
        <Link className="cart-line-name" to={`/products/${item.product_id}`}>
          {item.model}
        </Link>
        <div className="cart-line-price">{formatPrice(item.price_eur)}</div>
        <div className="cart-quantity" aria-label={`Cantidad de ${item.model}`}>
          <button
            type="button"
            aria-label={`Quitar una unidad de ${item.model}`}
            disabled={item.quantity <= 1}
            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            aria-label={`Añadir una unidad de ${item.model}`}
            disabled={item.quantity >= item.stock}
            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
      <div className="cart-line-side">
        <strong>{formatPrice(subtotal)}</strong>
        <button
          className="cart-remove"
          type="button"
          onClick={() => {
            removeItem(item.product_id);
            notify(`${item.brand} ${item.model} eliminado del carrito.`);
          }}
        >
          Quitar
        </button>
      </div>
    </article>
  );
}

export default CartLine;
