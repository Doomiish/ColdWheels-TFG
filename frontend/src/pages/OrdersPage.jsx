import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatusPanel from '../components/StatusPanel.jsx';
import useAuth from '../contexts/useAuth.js';
import { formatDate, formatPrice } from '../services/formatters.js';
import { getMySales } from '../services/salesService.js';

function OrdersPage() {
  const { accessToken } = useAuth();
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedSale, setExpandedSale] = useState(null);

  useEffect(() => {
    let active = true;
    getMySales(accessToken)
      .then((orders) => active && setSales(orders))
      .catch((requestError) => active && setError(requestError.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [accessToken]);

  return (
    <main className="container page-section">
      <div className="orders-heading">
        <div>
          <p className="eyebrow text-secondary">COLDWHEELS / HISTORIAL</p>
          <h1 className="page-title">Mis pedidos</h1>
        </div>
        <Link className="btn btn-outline-primary" to="/products">
          Seguir explorando
        </Link>
      </div>
      {loading && (
        <StatusPanel type="loading" title="Cargando pedidos">
          Estamos consultando tu historial.
        </StatusPanel>
      )}
      {error && (
        <StatusPanel type="error" title="No se pudo cargar el historial">
          {error}
        </StatusPanel>
      )}
      {!loading && !error && sales.length === 0 && (
        <div className="orders-empty">
          <span className="empty-wheel" aria-hidden="true">
            ✳
          </span>
          <h2 className="h4">Aún no tienes pedidos.</h2>
          <p>Tu próximo recorrido empieza por aquí.</p>
          <Link className="btn btn-primary" to="/products">
            Ver catálogo
          </Link>
        </div>
      )}
      {!loading && !error && sales.length > 0 && (
        <div className="orders-list">
          {sales.map((sale) => {
            const expanded = expandedSale === sale.id;
            return (
              <article className="order-card" key={sale.id}>
                <div className="order-card-heading">
                  <div>
                    <p className="order-label">PEDIDO</p>
                    <h2>{sale.order_number}</h2>
                    <span>{formatDate(sale.created_at)}</span>
                  </div>
                  <div className="order-total">
                    <span>Total · {sale.currency}</span>
                    <strong>{formatPrice(sale.total, sale.currency)}</strong>
                  </div>
                </div>
                <button
                  className="order-toggle"
                  type="button"
                  aria-expanded={expanded}
                  onClick={() => setExpandedSale(expanded ? null : sale.id)}
                >
                  {expanded
                    ? 'Ocultar detalle'
                    : `Ver detalle · ${sale.items.length} ${sale.items.length === 1 ? 'artículo' : 'artículos'}`}
                  <span aria-hidden="true">{expanded ? '−' : '+'}</span>
                </button>
                {expanded && (
                  <div className="order-detail">
                    {sale.items.map((item) => (
                      <div className="order-item" key={item.id}>
                        <div className="order-item-art" aria-hidden="true">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt=""
                              onError={(event) => {
                                event.currentTarget.hidden = true;
                              }}
                            />
                          ) : null}
                          <span>CW</span>
                        </div>
                        <div className="order-item-description">
                          <strong>
                            {item.brand} {item.model}
                          </strong>
                          <span>
                            {item.year} · Cantidad: {item.quantity}
                          </span>
                          <span>
                            Precio unitario:{' '}
                            {formatPrice(item.unit_price, sale.currency)}
                          </span>
                        </div>
                        <strong>
                          {formatPrice(item.total, sale.currency)}
                        </strong>
                      </div>
                    ))}
                    <div className="order-breakdown">
                      <span>
                        Base imponible{' '}
                        <strong>
                          {formatPrice(sale.subtotal, sale.currency)}
                        </strong>
                      </span>
                      <span>
                        IVA{' '}
                        <strong>{formatPrice(sale.tax, sale.currency)}</strong>
                      </span>
                      <span>
                        Tipo de cambio <strong>{sale.exchange_rate}</strong>
                      </span>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default OrdersPage;
