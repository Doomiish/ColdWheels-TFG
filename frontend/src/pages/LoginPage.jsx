import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';

function LoginPage() {
  const { signIn } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const notice = location.state?.message;
  const destination = location.state?.from?.pathname || '/';

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signIn({ email: email.trim(), password });
      navigate(destination, { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="container page-section auth-page">
      <div className="auth-card">
        <p className="eyebrow text-secondary">CUENTA COLDWHEELS</p>
        <h1 className="page-title">Qué bueno verte.</h1>
        <p className="text-secondary mb-4">
          Inicia sesión para continuar con tus pedidos y ajustes.
        </p>
        {notice && (
          <div className="alert alert-success" role="status">
            {notice}
          </div>
        )}
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" htmlFor="login-email">
              Email
            </label>
            <input
              className="form-control"
              id="login-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="form-label" htmlFor="login-password">
              Contraseña
            </label>
            <input
              className="form-control"
              id="login-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            className="btn btn-primary btn-lg w-100"
            type="submit"
            disabled={submitting}
          >
            {submitting ? 'Entrando…' : 'Iniciar sesión'}
          </button>
        </form>
        <p className="auth-switch">
          ¿Aún no tienes cuenta? <Link to="/register">Crear cuenta</Link>
        </p>
      </div>
    </main>
  );
}

export default LoginPage;
