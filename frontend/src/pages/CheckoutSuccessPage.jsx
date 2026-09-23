import { Link, useLocation } from 'react-router-dom';
import { formatDate, formatPrice } from '../services/formatters.js';
import useAuth from '../contexts/useAuth.js';

function CheckoutSuccessPage() {
  const { state } = useLocation();
  const { isAuthenticated } = useAuth();
  const sale = state?.sale;

  if (!sale) {
    return (
      <main className="container page-section">
        <div className="success-card">
          <h1 className="page-title">No hay un pedido reciente para mostrar</h1>
          <p>
            Los detalles de confirmación se muestran al terminar el checkout.
          </p>
          <Link className="btn btn-primary" to="/products">
            Ver catálogo
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <section className="success-card">
        <div className="success-check" aria-hidden="true">
          ✓
        </div>
        <p className="eyebrow text-secondary">
          PEDIDO CONFIRMADO / {formatDate(sale.created_at)}
        </p>
        <h1 className="page-title">Gracias por tu compra.</h1>
        <p className="success-order-number">{sale.order_number}</p>
        <div className="success-items">
          {sale.items.map((item) => (
            <div className="checkout-summary-item" key={item.id}>
              <div>
                <strong>
                  {item.brand} {item.model}
                </strong>
                <span>Cantidad: {item.quantity}</span>
              </div>
              <strong>{formatPrice(item.total, sale.currency)}</strong>
            </div>
          ))}
        </div>
        <div className="success-total">
          <span>Total · {sale.currency}</span>
          <strong>{formatPrice(sale.total, sale.currency)}</strong>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 mt-4">
          <Link className="btn btn-primary" to="/products">
            Volver al catálogo
          </Link>
          {isAuthenticated && (
            <Link className="btn btn-outline-primary" to="/orders">
              Mis pedidos
            </Link>
          )}
        </div>
      </section>
    </main>
  );
}

export default CheckoutSuccessPage;
