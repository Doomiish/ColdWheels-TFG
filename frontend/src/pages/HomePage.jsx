import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <main>
      <section className="home-hero">
        <div className="container home-hero-inner">
          <div className="home-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" /> EQUIPO PARA CLIMAS EXIGENTES
            </p>
            <h1>
              El frío cambia el camino. <span>Tu equipo, no.</span>
            </h1>
            <p className="home-lead">
              Explora motos y equipamiento pensado para seguir rodando cuando
              baja la temperatura.
            </p>
            <Link className="btn btn-light btn-lg home-cta" to="/products">
              Explorar catálogo <span aria-hidden="true">↗</span>
            </Link>
            <div className="home-proof">
              <span className="proof-dot" /> Selección preparada para salir
            </div>
          </div>
          <div className="hero-art" aria-hidden="true">
            <div className="hero-orbit hero-orbit-outer" />
            <div className="hero-orbit hero-orbit-inner" />
            <div className="hero-snowflake">✳</div>
            <div className="hero-index">CW / 01</div>
            <div className="hero-coordinate">
              40°25′ N<br />
              3°42′ O
            </div>
          </div>
        </div>
        <div className="hero-bottom container">
          <span>DISEÑADO PARA CONTINUAR</span>
          <span className="hero-bottom-rule" />
          <span>FRÍO · RUTA · LIBERTAD</span>
        </div>
      </section>
      <section className="home-intro container py-5">
        <p className="eyebrow text-secondary">COLDWHEELS / EQUIPAMIENTO</p>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-end gap-3">
          <h2 className="section-heading mb-0">
            Menos excusas.
            <br />
            <span>Más carretera.</span>
          </h2>
          <p className="intro-copy mb-1">
            Encuentra tu próximo compañero de ruta y revisa cada detalle antes
            de decidir.
          </p>
        </div>
      </section>
    </main>
  );
}

export default HomePage;
