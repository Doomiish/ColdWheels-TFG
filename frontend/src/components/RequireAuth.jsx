import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuth from '../contexts/useAuth.js';
import StatusPanel from './StatusPanel.jsx';

function RequireAuth() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="container page-section">
        <StatusPanel type="loading">Restaurando sesión…</StatusPanel>
      </main>
    );
  }
  if (!isAuthenticated)
    return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export default RequireAuth;
