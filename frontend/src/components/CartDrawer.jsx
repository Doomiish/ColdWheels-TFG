import { Link } from 'react-router-dom';
import CartLine from './CartLine.jsx';
import useCart from '../contexts/useCart.js';
import { formatPrice } from '../services/formatters.js';

function CartDrawer() {
  const { closeCart, estimatedTotal, isOpen, items, itemCount } = useCart();
  if (!isOpen) return null;

  return (
    <div className="cart-drawer-layer">
      <button
        className="cart-drawer-backdrop"
        type="button"
        aria-label="Cerrar carrito"
        onClick={closeCart}
      />
      <aside
        className="cart-drawer offcanvas offcanvas-end show"
        aria-label="Carrito de compra"
      >
        <div className="offcanvas-header">
          <div>
            <p className="eyebrow text-secondary mb-1">
              COLDWHEELS / SELECCIÓN
            </p>
            <h2 className="offcanvas-title h4">
              Tu carrito <span className="cart-count">{itemCount}</span>
            </h2>
          </div>
          <button
            className="btn-close"
            type="button"
            aria-label="Cerrar carrito"
            onClick={closeCart}
          />
        </div>
        <div className="offcanvas-body">
          {items.length === 0 ? (
            <div className="cart-empty-drawer">
              <p>Tu carrito está vacío.</p>
              <Link
                className="btn btn-outline-primary"
                to="/products"
                onClick={closeCart}
              >
                Ver catálogo
              </Link>
            </div>
          ) : (
            <>
              <div className="cart-drawer-lines">
                {items.map((item) => (
                  <CartLine compact item={item} key={item.product_id} />
                ))}
              </div>
              <div className="cart-drawer-total">
                <span>Suma de catálogo · EUR</span>
                <strong>{formatPrice(estimatedTotal)}</strong>
              </div>
              <Link
                className="btn btn-primary btn-lg w-100"
                to="/checkout"
                onClick={closeCart}
              >
                Continuar al checkout
              </Link>
              <Link
                className="btn btn-link w-100 mt-2"
                to="/cart"
                onClick={closeCart}
              >
                Ver carrito completo
              </Link>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}

export default CartDrawer;
