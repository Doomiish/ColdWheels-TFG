import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';

function RegisterPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signUp({ ...form, email: form.email.trim() });
      navigate('/login', {
        replace: true,
        state: {
          message: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
        },
      });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container page-section auth-page">
      <div className="auth-card">
        <p className="eyebrow text-secondary">EMPIEZA TU SIGUIENTE RUTA</p>
        <h1 className="page-title">Crear cuenta</h1>
        <p className="text-secondary mb-4">
          Regístrate para tener tus pedidos a mano.
        </p>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-sm-6">
              <label className="form-label" htmlFor="register-first-name">
                Nombre
              </label>
              <input
                className="form-control"
                id="register-first-name"
                autoComplete="given-name"
                required
                value={form.first_name}
                onChange={(event) => update('first_name', event.target.value)}
              />
            </div>
            <div className="col-sm-6">
              <label className="form-label" htmlFor="register-last-name">
                Apellido
              </label>
              <input
                className="form-control"
                id="register-last-name"
                autoComplete="family-name"
                required
                value={form.last_name}
                onChange={(event) => update('last_name', event.target.value)}
              />
            </div>
          </div>
          <div className="my-3">
            <label className="form-label" htmlFor="register-email">
              Email
            </label>
            <input
              className="form-control"
              id="register-email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={(event) => update('email', event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="register-password">
              Contraseña
            </label>
            <input
              className="form-control"
              id="register-password"
              type="password"
              autoComplete="new-password"
              minLength={8}
              required
              value={form.password}
              onChange={(event) => update('password', event.target.value)}
            />
            <div className="form-text">Al menos 8 caracteres.</div>
          </div>
          <button
            className="btn btn-primary btn-lg w-100"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>
        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
        </p>
      </div>
    </main>
  );
}

export default RegisterPage;
