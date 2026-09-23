import { Link } from 'react-router-dom';
import CartLine from './CartLine.jsx';

function CheckoutError({ problem, item }) {
  if (!problem) return null;

  return (
    <section className="checkout-error" role="alert">
      <div className="checkout-error-icon" aria-hidden="true">
        !
      </div>
      <div className="checkout-error-content">
        <h2 className="h5">{problem.title}</h2>
        <p>{problem.message}</p>
        {problem.productId && (
          <div className="checkout-product-issue">
            {item ? (
              <>
                <p className="small fw-semibold mb-0">Producto afectado</p>
                <CartLine item={item} />
                <p className="small text-secondary mt-2">
                  Ajusta la cantidad o quita este artículo y vuelve a
                  intentarlo.
                </p>
              </>
            ) : (
              <p className="small mb-0">
                Producto #{problem.productId} ya no aparece en el carrito.
                Revisa tu selección antes de reintentar.
              </p>
            )}
          </div>
        )}
        {problem.kind === 'session' && (
          <Link
            className="btn btn-outline-primary btn-sm"
            to="/login"
            state={{ from: { pathname: '/checkout' } }}
          >
            Iniciar sesión de nuevo
          </Link>
        )}
        {problem.kind === 'connection' && (
          <p className="small mb-0">
            Comprueba que el backend está iniciado y vuelve a intentarlo.
          </p>
        )}
      </div>
    </section>
  );
}

export default CheckoutError;
