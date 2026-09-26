import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import { getProducts } from '../services/productService.js';

const categories = [
  {
    name: 'Racing',
    description: 'Competición pura',
    image: '/img/racing/porsche-911-gt3-r.png',
  },
  {
    name: 'Supercars',
    description: 'Alto rendimiento',
    image: '/img/supercars/porsche-918-spyder.png',
  },
  {
    name: 'Street / Tuning',
    description: 'Cultura urbana',
    image: '/img/street-tuning/nissan-silvia-s15.png',
  },
  {
    name: 'Classics',
    description: 'Leyendas atemporales',
    image: '/img/classics/bmw-2002.png',
  },
  {
    name: 'Off-Road / Utility',
    description: 'Más allá del asfalto',
    image: '/img/off-road/toyota-fj40.png',
  },
];

const featuredImages = [
  '/img/racing/lancia-delta-hf-integrale-8v.png',
  '/img/classics/chevrolet-camaro-ss.png',
  '/img/supercars/mclaren-f1-gtr-50-jacadi.png',
  '/img/classics/volkswagen-golf-gti-mk1.png',
];

function HomePage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let active = true;

    getProducts()
      .then((items) => active && setProducts(items))
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const featuredProducts = featuredImages
    .map((image) => products.find((product) => product.image === image))
    .filter(Boolean);

  return (
    <main>
      <section className="home-hero">
        <img
          className="home-hero-image"
          src="/img/hero/volkswagen-fox-mk1-hero.png"
          alt="Volkswagen Fox MK1 en un garaje"
        />

        <div className="home-hero-overlay" aria-hidden="true" />

        <div className="container home-hero-inner">
          <div className="home-copy">
            <p className="eyebrow">
              <span className="eyebrow-line" />
              COLLECTOR CARS
            </p>

            <h1>
              Escala pequeña.
              <br />
              <span>Cultura enorme.</span>
            </h1>

            <p className="home-lead">Autos icónicos. Pasión por lo bueno.</p>

            <Link className="btn home-cta" to="/products">
              Explorar la colección
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="home-categories">
        <div className="container">
          <div className="home-categories-top">
            <p className="eyebrow">CATEGORÍAS</p>

            <Link className="home-categories-all" to="/products">
              Ver todas las categorías
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          <div className="home-category-layout">
            <div className="home-categories-title">
              <h2 className="section-heading">
                Explora
                <br />
                <span>por estilo</span>
              </h2>
            </div>

            <div className="home-category-grid">
              {categories.map((category) => (
                <Link
                  className="home-category-card"
                  key={category.name}
                  to={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  <img
                    className="home-category-image"
                    src={category.image}
                    alt={category.name}
                  />

                  <div className="home-category-overlay" />

                  <div className="home-category-content">
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                    <span className="home-category-arrow" aria-hidden="true">
                      →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-featured">
        <div className="container">
          <div className="home-featured-top">
            <div>
              <p className="eyebrow">PRODUCTOS DESTACADOS</p>

              <h2 className="section-heading">
                Piezas que <span>hacen historia</span>
              </h2>
            </div>

            <Link className="home-featured-all" to="/products">
              Ver catálogo completo
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {featuredProducts.length > 0 && (
            <div className="home-featured-grid">
              {featuredProducts.map((product) => (
                <div className="home-featured-item" key={product.id}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default HomePage;
