import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';
import useCart from '../contexts/useCart.js';
import useToast from '../contexts/useToast.js';
import Brand from './Brand.jsx';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const { itemCount } = useCart();
  const { notify } = useToast();
  const navigate = useNavigate();
  const closeMenu = () => setMenuOpen(false);

  function handleSignOut() {
    signOut();
    notify('Has cerrado sesión.');
    closeMenu();
    navigate('/');
  }

  return (
    <header className="site-header">
      <nav
        className="navbar navbar-expand-lg container py-3"
        aria-label="Navegación principal"
      >
        <Brand />
        <button
          className="navbar-toggler"
          type="button"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className={`collapse navbar-collapse${menuOpen ? ' show' : ''}`}>
          <div className="navbar-nav ms-auto align-items-lg-center gap-lg-2 pt-3 pt-lg-0">
            <NavLink className="nav-link" to="/" onClick={closeMenu}>
              Inicio
            </NavLink>
            <NavLink className="nav-link" to="/products" onClick={closeMenu}>
              Catálogo
            </NavLink>
            <NavLink className="nav-link" to="/cart" onClick={closeMenu}>
              <svg
                className="navbar-icon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  d="M3 4h2l2.1 10.1a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 1.9-1.4L20.5 8H6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="19" r="1.2" fill="currentColor" />
                <circle cx="18" cy="19" r="1.2" fill="currentColor" />
              </svg>
              <span>Carrito ({itemCount})</span>
            </NavLink>

            {!loading && isAuthenticated ? (
              <>
                <NavLink className="nav-link" to="/orders" onClick={closeMenu}>
                  Mis pedidos
                </NavLink>
                <NavLink
                  className="nav-link"
                  to="/settings"
                  onClick={closeMenu}
                >
                  Ajustes
                </NavLink>
                <span className="navbar-user d-none d-lg-inline">
                  Hola, {user.first_name}
                </span>
                <button
                  className="btn btn-outline-dark btn-sm ms-lg-2"
                  type="button"
                  onClick={handleSignOut}
                >
                  Cerrar sesión
                </button>
              </>
            ) : !loading ? (
              <>
                <Link
                  className="btn btn-outline-dark btn-sm ms-lg-2"
                  to="/login"
                  onClick={closeMenu}
                >
                  <svg
                    className="navbar-icon"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="8"
                      r="3.2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M5.5 20a6.5 6.5 0 0 1 13 0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  className="btn btn-primary btn-sm ms-lg-2"
                  to="/register"
                  onClick={closeMenu}
                >
                  Crear cuenta
                </Link>
              </>
            ) : null}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
