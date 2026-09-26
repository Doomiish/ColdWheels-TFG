import { Link } from 'react-router-dom';
import CartLine from '../components/CartLine.jsx';
import useCart from '../contexts/useCart.js';
import { formatPrice } from '../services/formatters.js';
import useToast from '../contexts/useToast.js';

function CartPage() {
  const { clearCart, estimatedTotal, items } = useCart();
  const { notify } = useToast();

  return (
    <main className="container page-section">
      <div className="cart-page-heading">
        <div>
          <p className="eyebrow text-secondary">COLDWHEELS / TU SELECCIÓN</p>
          <h1 className="page-title">Carrito</h1>
        </div>
        {items.length > 0 && (
          <button
            className="btn btn-link text-secondary"
            type="button"
            onClick={() => {
              clearCart();
              notify('Carrito vaciado.');
            }}
          >
            Vaciar carrito
          </button>
        )}
      </div>
      {items.length === 0 ? (
        <div className="cart-page-empty">
          <div className="empty-wheel" aria-hidden="true">
            ✳
          </div>
          <h2 className="h4">Tu carrito está vacío.</h2>
          <p>Encuentra el equipo para tu próxima ruta.</p>
          <Link className="btn btn-primary" to="/products">
            Ver catálogo
          </Link>
        </div>
      ) : (
        <div className="row g-4 align-items-start">
          <div className="col-lg-8">
            <div className="cart-page-lines">
              {items.map((item) => (
                <CartLine item={item} key={item.product_id} />
              ))}
            </div>
          </div>
          <div className="col-lg-4">
            <aside className="cart-summary">
              <h2 className="h5">Resumen</h2>
              <div className="summary-row">
                <span>Suma de catálogo · EUR</span>
                <strong>{formatPrice(estimatedTotal)}</strong>
              </div>
              <p className="small text-secondary">
                Los precios mostrados son orientativos. El importe final y la
                disponibilidad se confirman al tramitar el pedido.
              </p>
              <Link className="btn btn-primary btn-lg w-100" to="/checkout">
                Continuar al checkout
              </Link>
              <Link className="btn btn-link w-100 mt-2" to="/products">
                Seguir explorando
              </Link>
            </aside>
          </div>
        </div>
      )}
    </main>
  );
}

export default CartPage;
