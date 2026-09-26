import { Link } from 'react-router-dom';

function Brand({ light = false }) {
  return (
    <Link
      className={`brand${light ? ' brand-light' : ''}`}
      to="/"
      aria-label="ColdWheels, inicio"
    >
      <img
        className="brand-logo"
        src="/img/brand/coldwheels-logo.png"
        alt="ColdWheels"
      />
    </Link>
  );
}

export default Brand;
