import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatusPanel from '../components/StatusPanel.jsx';
import useAuth from '../contexts/useAuth.js';
import useCart from '../contexts/useCart.js';
import { formatPrice } from '../services/formatters.js';
import { submitCheckout } from '../services/checkoutService.js';
import { describeCheckoutError } from '../services/checkoutErrors.js';
import CheckoutError from '../components/CheckoutError.jsx';

const emptyGuest = {
  first_name: '',
  last_name: '',
  address: '',
  postal_code: '',
};
const emptyPayment = { cardholder: '', card_number: '', expiry: '', cvv: '' };

const USD_EXCHANGE_RATE = 1.15;

function getDisplayPrice(priceEur, currency) {
  const price = Number(priceEur);

  if (!Number.isFinite(price)) return priceEur;

  return currency === 'USD' ? price * USD_EXCHANGE_RATE : price;
}

function CheckoutPage() {
  const {
    accessToken,
    isAuthenticated,
    loading: authLoading,
    user,
  } = useAuth();
  const { clearCart, items } = useCart();
  const navigate = useNavigate();
  const [mode, setMode] = useState(isAuthenticated ? 'authenticated' : '');
  const [currency, setCurrency] = useState('EUR');
  const [guest, setGuest] = useState(emptyGuest);
  const [payment, setPayment] = useState(emptyPayment);
  const [validationErrors, setValidationErrors] = useState({});
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) {
      setError({
        kind: 'validation',
        title: 'Tu carrito está vacío',
        message: 'Añade algún producto antes de continuar.',
      });
      return;
    }
    if (!mode) {
      setError({
        kind: 'validation',
        title: 'Elige cómo continuar',
        message: 'Inicia sesión o selecciona la opción de invitado.',
      });
      return;
    }

    const errors = validateForm();

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});
    setError(null);
    setSubmitting(true);
    try {
      const sale = await submitCheckout({
        token: accessToken,
        currency,
        items,
        guest: mode === 'guest' ? guest : undefined,
      });
      clearCart();
      navigate('/checkout/success', { replace: true, state: { sale } });
    } catch (requestError) {
      setError(describeCheckoutError(requestError));
    } finally {
      setSubmitting(false);
    }
  }

  function updateGuest(field, value) {
    setGuest((current) => ({ ...current, [field]: value }));
    setValidationErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function updatePayment(field, value) {
    setPayment((current) => ({ ...current, [field]: value }));
    setValidationErrors((current) => {
      const next = { ...current };
      delete next[field];
      return next;
    });
  }

  function validateForm() {
    const errors = {};

    if (mode === 'guest') {
      const namePattern = /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñÀ-ÿ'’ -]+$/;
      const postalCodePattern = /^\d{5}$/;

      if (!guest.first_name.trim()) {
        errors.first_name = 'El nombre es obligatorio.';
      } else if (!namePattern.test(guest.first_name.trim())) {
        errors.first_name = 'El nombre solo puede contener letras.';
      }

      if (!guest.last_name.trim()) {
        errors.last_name = 'El apellido es obligatorio.';
      } else if (!namePattern.test(guest.last_name.trim())) {
        errors.last_name = 'El apellido solo puede contener letras.';
      }

      if (!guest.address.trim()) {
        errors.address = 'La dirección es obligatoria.';
      }

      if (!guest.postal_code.trim()) {
        errors.postal_code = 'El código postal es obligatorio.';
      } else if (!postalCodePattern.test(guest.postal_code.trim())) {
        errors.postal_code = 'El código postal debe tener 5 dígitos.';
      }
    }

    if (!payment.cardholder.trim()) {
      errors.cardholder = 'El nombre del titular es obligatorio.';
    }

    const cardDigits = payment.card_number.replace(/\s/g, '');

    if (!cardDigits) {
      errors.card_number = 'El número de tarjeta es obligatorio.';
    } else if (!/^\d{13,19}$/.test(cardDigits)) {
      errors.card_number =
        'El número de tarjeta debe tener entre 13 y 19 dígitos.';
    }

    if (!payment.expiry) {
      errors.expiry = 'La fecha de caducidad es obligatoria.';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) {
      errors.expiry = 'Introduce una fecha válida en formato MM/AA.';
    }

    if (!payment.cvv) {
      errors.cvv = 'El CVV es obligatorio.';
    } else if (!/^\d{3,4}$/.test(payment.cvv)) {
      errors.cvv = 'El CVV debe tener 3 o 4 dígitos.';
    }

    return errors;
  }

  if (authLoading) {
    return (
      <main className="container page-section">
        <StatusPanel type="loading">Comprobando tu sesión…</StatusPanel>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="container page-section">
        <StatusPanel
          title="Tu carrito está vacío."
          action={
            <Link className="btn btn-primary" to="/products">
              Ver catálogo
            </Link>
          }
        >
          Añade productos antes de iniciar el checkout.
        </StatusPanel>
      </main>
    );
  }

  return (
    <main className="container page-section">
      <p className="eyebrow text-secondary">COLDWHEELS / CHECKOUT</p>
      <h1 className="page-title mb-4">Preparar pedido</h1>
      {error && (
        <CheckoutError
          problem={error}
          item={
            error.productId
              ? items.find((item) => item.product_id === error.productId)
              : null
          }
        />
      )}
      <div className="row g-4 align-items-start">
        <div className="col-lg-7">
          <form className="checkout-card" onSubmit={handleSubmit} noValidate>
            {!isAuthenticated && (
              <section className="checkout-choice">
                <h2 className="h5">¿Ya tienes una cuenta?</h2>
                <p className="text-secondary">
                  Puedes iniciar sesión o continuar como invitado.
                </p>
                <div className="d-flex flex-wrap gap-2">
                  <Link
                    className="btn btn-outline-primary"
                    to="/login"
                    state={{ from: { pathname: '/checkout' } }}
                  >
                    Iniciar sesión
                  </Link>
                  <button
                    className={`btn ${mode === 'guest' ? 'btn-primary' : 'btn-outline-primary'}`}
                    type="button"
                    onClick={() => setMode('guest')}
                  >
                    Continuar como invitado
                  </button>
                </div>
              </section>
            )}
            {isAuthenticated && (
              <section className="checkout-choice">
                <p className="eyebrow text-secondary mb-1">
                  PEDIDO CON TU CUENTA
                </p>
                <p className="mb-0">
                  {user.first_name} {user.last_name} · {user.email}
                </p>
              </section>
            )}
            {(mode === 'guest' || isAuthenticated) && (
              <>
                {mode === 'guest' && (
                  <section className="checkout-fields">
                    <h2 className="h5 mb-3">Datos de entrega</h2>
                    <div className="row g-3">
                      <div className="col-sm-6">
                        <label
                          className="form-label"
                          htmlFor="guest-first-name"
                        >
                          Nombre
                        </label>
                        <input
                          className={`form-control ${validationErrors.first_name ? 'is-invalid' : ''}`}
                          id="guest-first-name"
                          autoComplete="given-name"
                          value={guest.first_name}
                          onChange={(event) =>
                            updateGuest('first_name', event.target.value)
                          }
                        />
                        {validationErrors.first_name && (
                          <div className="invalid-feedback">
                            {validationErrors.first_name}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label" htmlFor="guest-last-name">
                          Apellido
                        </label>
                        <input
                          className={`form-control ${validationErrors.last_name ? 'is-invalid' : ''}`}
                          id="guest-last-name"
                          autoComplete="family-name"
                          value={guest.last_name}
                          onChange={(event) =>
                            updateGuest('last_name', event.target.value)
                          }
                        />
                        {validationErrors.last_name && (
                          <div className="invalid-feedback">
                            {validationErrors.last_name}
                          </div>
                        )}
                      </div>
                      <div className="col-12">
                        <label className="form-label" htmlFor="guest-address">
                          Dirección
                        </label>
                        <input
                          className={`form-control ${validationErrors.address ? 'is-invalid' : ''}`}
                          id="guest-address"
                          autoComplete="street-address"
                          value={guest.address}
                          onChange={(event) =>
                            updateGuest('address', event.target.value)
                          }
                        />
                        {validationErrors.address && (
                          <div className="invalid-feedback">
                            {validationErrors.address}
                          </div>
                        )}
                      </div>
                      <div className="col-sm-6">
                        <label className="form-label" htmlFor="guest-postal">
                          Código postal
                        </label>
                        <input
                          className={`form-control ${validationErrors.postal_code ? 'is-invalid' : ''}`}
                          id="guest-postal"
                          autoComplete="postal-code"
                          value={guest.postal_code}
                          onChange={(event) =>
                            updateGuest('postal_code', event.target.value)
                          }
                        />
                        {validationErrors.postal_code && (
                          <div className="invalid-feedback">
                            {validationErrors.postal_code}
                          </div>
                        )}
                      </div>
                    </div>
                  </section>
                )}
                <section className="checkout-fields">
                  <label className="form-label" htmlFor="checkout-currency">
                    Moneda
                  </label>
                  <select
                    className="form-select"
                    id="checkout-currency"
                    value={currency}
                    onChange={(event) => setCurrency(event.target.value)}
                  >
                    <option value="EUR">EUR — Euro</option>
                    <option value="USD">USD — Dólar estadounidense</option>
                  </select>
                </section>
                <section className="checkout-fields">
                  <h2 className="h5 mb-3">Datos de pago</h2>
                  <div className="row g-3">
                    <div className="col-12">
                      <label
                        className="form-label"
                        htmlFor="payment-cardholder"
                      >
                        Nombre del titular
                      </label>
                      <input
                        className={`form-control ${validationErrors.cardholder ? 'is-invalid' : ''}`}
                        id="payment-cardholder"
                        autoComplete="cc-name"
                        value={payment.cardholder}
                        onChange={(event) =>
                          updatePayment('cardholder', event.target.value)
                        }
                      />
                      {validationErrors.cardholder && (
                        <div className="invalid-feedback">
                          {validationErrors.cardholder}
                        </div>
                      )}
                    </div>

                    <div className="col-12">
                      <label
                        className="form-label"
                        htmlFor="payment-card-number"
                      >
                        Número de tarjeta
                      </label>
                      <input
                        className={`form-control ${validationErrors.card_number ? 'is-invalid' : ''}`}
                        id="payment-card-number"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-number"
                        value={payment.card_number}
                        onChange={(event) =>
                          updatePayment('card_number', event.target.value)
                        }
                      />
                      {validationErrors.card_number && (
                        <div className="invalid-feedback">
                          {validationErrors.card_number}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="payment-expiry">
                        Fecha de caducidad
                      </label>
                      <input
                        className={`form-control ${validationErrors.expiry ? 'is-invalid' : ''}`}
                        id="payment-expiry"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-exp"
                        placeholder="MM/AA"
                        value={payment.expiry}
                        onChange={(event) =>
                          updatePayment('expiry', event.target.value)
                        }
                      />
                      {validationErrors.expiry && (
                        <div className="invalid-feedback">
                          {validationErrors.expiry}
                        </div>
                      )}
                    </div>

                    <div className="col-sm-6">
                      <label className="form-label" htmlFor="payment-cvv">
                        CVV
                      </label>
                      <input
                        className={`form-control ${validationErrors.cvv ? 'is-invalid' : ''}`}
                        id="payment-cvv"
                        type="text"
                        inputMode="numeric"
                        autoComplete="cc-csc"
                        value={payment.cvv}
                        onChange={(event) =>
                          updatePayment('cvv', event.target.value)
                        }
                      />
                      {validationErrors.cvv && (
                        <div className="invalid-feedback">
                          {validationErrors.cvv}
                        </div>
                      )}
                    </div>
                  </div>

                  <p className="small text-secondary mt-3 mb-0">
                    Pago simulado para el proyecto. Los datos de tarjeta no se
                    almacenan.
                  </p>
                </section>
                <button
                  className="btn btn-primary btn-lg w-100 mt-4"
                  type="submit"
                  disabled={submitting || items.length === 0}
                >
                  {submitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        aria-hidden="true"
                      />
                      Procesando pedido…
                    </>
                  ) : (
                    'Confirmar pedido'
                  )}
                </button>
              </>
            )}
          </form>
        </div>
        <div className="col-lg-5">
          <aside className="checkout-summary">
            <h2 className="h5">
              Tu selección{' '}
              <span className="cart-count">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </h2>
            {items.map((item) => {
              const displayPrice = getDisplayPrice(item.price_eur, currency);
              const displayTotal = displayPrice * item.quantity;

              return (
                <div className="checkout-summary-item" key={item.product_id}>
                  <div>
                    <strong>
                      {item.brand} {item.model}
                    </strong>
                    <span>
                      {item.quantity} × {formatPrice(displayPrice, currency)}
                    </span>
                  </div>
                  <strong>{formatPrice(displayTotal, currency)}</strong>
                </div>
              );
            })}
            <p className="small text-secondary mt-3 mb-0">
              El importe mostrado es orientativo. El total definitivo se calcula
              al confirmar el pedido.
            </p>
            <Link className="back-link d-inline-block mt-3" to="/cart">
              ← Volver al carrito
            </Link>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default CheckoutPage;
