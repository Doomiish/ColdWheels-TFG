import { Link } from 'react-router-dom';

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="ColdWheels, inicio">
      <img
        className="brand-logo"
        src="/img/brand/coldwheels-logo.png"
        alt="ColdWheels"
      />
    </Link>
  );
}

export default Brand;
