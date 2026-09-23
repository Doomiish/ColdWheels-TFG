import { Link } from 'react-router-dom';

function Brand({ light = false }) {
  return (
    <Link
      className={`brand${light ? ' brand-light' : ''}`}
      to="/"
      aria-label="ColdWheels, inicio"
    >
      <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
        <path
          d="M20 2.5 36 11.25v17.5L20 37.5 4 28.75v-17.5L20 2.5Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <circle
          cx="20"
          cy="20"
          r="7.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        />
        <path
          d="M20 5v7m0 16v7M7 12.5l6 3.5m14 8 6 3.5M7 27.5l6-3.5m14-8 6-3.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="20" cy="20" r="2" fill="currentColor" />
      </svg>
      <span className="brand-wordmark">
        COLD<span>WHEELS</span>
      </span>
    </Link>
  );
}

export default Brand;
