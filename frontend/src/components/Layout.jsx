import { Outlet } from 'react-router-dom';
import Footer from './Footer.jsx';
import Navbar from './Navbar.jsx';
import CartDrawer from './CartDrawer.jsx';

function Layout() {
  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-content">
        <Outlet />
      </div>
      <Footer />
      <CartDrawer />
    </div>
  );
}

export default Layout;
