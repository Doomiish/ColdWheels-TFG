function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-overlay" aria-hidden="true" />
      <div className="site-footer-content">
        <img
          className="site-footer-emblem"
          src="/img/brand/coldwheels-emblem.png"
          alt="ColdWheels"
        />

        <p className="footer-note">Preparados para el próximo tramo.</p>

        <span className="footer-copyright">
          © {new Date().getFullYear()} ColdWheels
        </span>
      </div>
    </footer>
  );
}

export default Footer;
