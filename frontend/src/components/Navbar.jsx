import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';
import useCart from '../contexts/useCart.js';
import useToast from '../contexts/useToast.js';
import Brand from './Brand.jsx';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, loading, signOut, user } = useAuth();
  const { itemCount, openCart } = useCart();
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
            <NavLink className="nav-link" to="/products" onClick={closeMenu}>
              Catálogo
            </NavLink>
            <NavLink className="nav-link" to="/cart" onClick={closeMenu}>
              Carrito ({itemCount})
            </NavLink>
            <button
              className="btn btn-sm btn-light cart-open-button"
              type="button"
              aria-label="Abrir carrito lateral"
              onClick={() => {
                openCart();
                closeMenu();
              }}
            >
              Ver carrito
            </button>
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
                  Iniciar sesión
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
