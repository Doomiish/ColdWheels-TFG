import Brand from './Brand.jsx';

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container d-flex flex-column flex-sm-row align-items-sm-center justify-content-between gap-3">
        <Brand light />
        <p className="mb-0 footer-note">Preparados para el próximo tramo.</p>
        <span className="footer-copyright">
          © {new Date().getFullYear()} ColdWheels
        </span>
      </div>
    </footer>
  );
}

export default Footer;
