"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

type Snake = {
  id: number;
  name: string;
  species: string;
  morph: string;
  price: number;
  experience: "Principiante" | "Intermedio";
  image: string;
  alt: string;
  badge?: string;
};

const snakes: Snake[] = [
  {
    id: 1,
    name: "Pitón bola Pastel",
    species: "Pitón bola",
    morph: "Pastel · nacida en cautiverio",
    price: 3200,
    experience: "Principiante",
    image: "https://images.pexels.com/photos/18018566/pexels-photo-18018566.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Detalle de las escamas de una pitón",
    badge: "Favorita",
  },
  {
    id: 2,
    name: "Serpiente del maíz Okeetee",
    species: "Serpiente del maíz",
    morph: "Okeetee · patrón clásico",
    price: 2400,
    experience: "Principiante",
    image: "https://images.pexels.com/photos/26833159/pexels-photo-26833159.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Serpiente descansando sobre una rama",
    badge: "Nueva",
  },
  {
    id: 3,
    name: "Pitón bola Caramel",
    species: "Pitón bola",
    morph: "Caramel · tonos cálidos",
    price: 3800,
    experience: "Principiante",
    image: "https://images.pexels.com/photos/35908435/pexels-photo-35908435.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Pitón de tonos cálidos en su hábitat",
  },
  {
    id: 4,
    name: "Culebra rey de California",
    species: "Culebra rey",
    morph: "Bicolor · criada bajo cuidado humano",
    price: 2900,
    experience: "Intermedio",
    image: "https://images.pexels.com/photos/4576625/pexels-photo-4576625.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Serpiente entre el pasto",
  },
  {
    id: 5,
    name: "Pitón bola Banana",
    species: "Pitón bola",
    morph: "Banana · amarillo y lavanda",
    price: 4600,
    experience: "Intermedio",
    image: "https://images.pexels.com/photos/18120741/pexels-photo-18120741.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Primer plano de una pitón en un terrario",
    badge: "Pieza especial",
  },
  {
    id: 6,
    name: "Serpiente del maíz Snow",
    species: "Serpiente del maíz",
    morph: "Snow · tonos marfil y rosa",
    price: 2700,
    experience: "Principiante",
    image: "https://images.pexels.com/photos/5140821/pexels-photo-5140821.jpeg?auto=compress&cs=tinysrgb&w=900",
    alt: "Serpiente rodeada de hojas verdes",
  },
];

const formatPrice = (price: number) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 0,
  }).format(price);

const speciesOptions = ["Pitón bola", "Serpiente del maíz", "Culebra rey"];
const experienceOptions = ["Principiante", "Intermedio"] as const;

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("featured");
  const [selectedSpecies, setSelectedSpecies] = useState<string[]>([]);
  const [selectedExperience, setSelectedExperience] = useState<string[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<{ snakeId: number; quantity: number }[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<number[]>([]);
  const [notice, setNotice] = useState("");

  const cartProducts = cartItems.flatMap(({ snakeId, quantity }) => {
    const snake = snakes.find((product) => product.id === snakeId);
    return snake ? [{ ...snake, quantity }] : [];
  });
  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  const cartTotal = cartProducts.reduce((total, item) => total + item.price * item.quantity, 0);

  const visibleSnakes = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase("es-MX");
    const filtered = snakes.filter((snake) => {
      const matchesSearch =
        !normalizedQuery ||
        `${snake.name} ${snake.species} ${snake.morph}`
          .toLocaleLowerCase("es-MX")
          .includes(normalizedQuery);
      const matchesSpecies =
        selectedSpecies.length === 0 || selectedSpecies.includes(snake.species);
      const matchesExperience =
        selectedExperience.length === 0 ||
        selectedExperience.includes(snake.experience);
      return matchesSearch && matchesSpecies && matchesExperience;
    });

    if (sort === "price-ascending") {
      return [...filtered].sort((a, b) => a.price - b.price);
    }
    if (sort === "price-descending") {
      return [...filtered].sort((a, b) => b.price - a.price);
    }
    return filtered;
  }, [query, selectedExperience, selectedSpecies, sort]);

  const toggleSelection = (
    option: string,
    selected: string[],
    setSelected: (selection: string[]) => void,
  ) => {
    setSelected(
      selected.includes(option)
        ? selected.filter((item) => item !== option)
        : [...selected, option],
    );
  };

  const clearFilters = () => {
    setSelectedSpecies([]);
    setSelectedExperience([]);
    setQuery("");
  };

  const addToCart = (snake: Snake) => {
    setCartItems((items) => {
      const existing = items.find((item) => item.snakeId === snake.id);
      return existing
        ? items.map((item) =>
            item.snakeId === snake.id
              ? { ...item, quantity: item.quantity + 1 }
              : item,
          )
        : [...items, { snakeId: snake.id, quantity: 1 }];
    });
    setNotice(`${snake.name} se agregó a tu bolsa.`);
  };

  const removeFromCart = (snakeId: number) => {
    setCartItems((items) => items.filter((item) => item.snakeId !== snakeId));
  };

  const toggleFavorite = (snake: Snake) => {
    const isFavorite = favoriteIds.includes(snake.id);
    setFavoriteIds((favorites) =>
      isFavorite
        ? favorites.filter((id) => id !== snake.id)
        : [...favorites, snake.id],
    );
    setNotice(
      isFavorite
        ? "Se quitó de tus favoritos."
        : `${snake.name} se guardó en favoritos.`,
    );
  };

  return (
    <>
      <div className="announcement">
        <span>Envío seguro y especializado en México</span>
        <span className="announcement-dot">✳</span>
        <span>Asesoría de cuidado antes y después</span>
        <span className="announcement-dot">✳</span>
        <span>Animales criados bajo cuidado humano</span>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#inicio" aria-label="Nido, inicio">
          <span className="wordmark-symbol" aria-hidden="true">N</span>
          <span className="wordmark-text">NIDO<span>REPTILES</span></span>
        </a>
        <nav className="main-nav" aria-label="Navegación principal">
          <a className="active" href="#catalogo">Serpientes</a>
          <a href="#cuidados">Guía de cuidado</a>
          <a href="#nosotros">Nuestra filosofía</a>
        </nav>
        <div className="header-actions">
          <button
            className="icon-button search-toggle"
            type="button"
            aria-label={searchOpen ? "Cerrar búsqueda" : "Buscar"}
            aria-expanded={searchOpen}
            onClick={() => setSearchOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.8" />
              <path d="m16 16 4.2 4.2" />
            </svg>
          </button>
          <a className="care-link" href="#cuidados">Visítanos</a>
          <button
            className="bag-button"
            type="button"
            aria-label={`Bolsa, ${cartCount} ${cartCount === 1 ? "artículo" : "artículos"}`}
            aria-expanded={cartOpen}
            aria-controls="cart-drawer"
            onClick={() => setCartOpen(true)}
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5.5 8.5h13l1 12h-15l1-12Z" />
              <path d="M9 9V6a3 3 0 0 1 6 0v3" />
            </svg>
            <span>Bolsa</span>
            <span className="bag-count">{cartCount}</span>
          </button>
        </div>
      </header>

      {searchOpen && (
        <form className="search-panel" onSubmit={(event) => event.preventDefault()}>
          <label htmlFor="snake-search">Buscar en el catálogo</label>
          <input
            id="snake-search"
            type="search"
            placeholder="Prueba “pitón bola”"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            autoFocus
          />
          <button type="button" onClick={() => setSearchOpen(false)}>Cerrar</button>
        </form>
      )}

      {cartOpen && (
        <div className="cart-layer">
          <button
            className="cart-backdrop"
            type="button"
            aria-label="Cerrar bolsa"
            onClick={() => setCartOpen(false)}
          />
          <aside
            className="cart-drawer"
            id="cart-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="cart-title"
          >
            <div className="cart-header">
              <div>
                <p className="eyebrow">Tu selección</p>
                <h2 id="cart-title">Tu bolsa <span>({cartCount})</span></h2>
              </div>
              <button
                className="cart-close"
                type="button"
                aria-label="Cerrar bolsa"
                onClick={() => setCartOpen(false)}
              >
                ×
              </button>
            </div>
            {cartProducts.length > 0 ? (
              <>
                <div className="cart-items">
                  {cartProducts.map((snake) => (
                    <div className="cart-item" key={snake.id}>
                      <Image src={snake.image} alt="" width={74} height={92} sizes="74px" />
                      <div className="cart-item-info">
                        <p>{snake.species}</p>
                        <h3>{snake.name}</h3>
                        <span>Cantidad: {snake.quantity}</span>
                        <button type="button" onClick={() => removeFromCart(snake.id)}>Quitar</button>
                      </div>
                      <strong>{formatPrice(snake.price * snake.quantity)}</strong>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <div><span>Subtotal estimado</span><strong>{formatPrice(cartTotal)} MXN</strong></div>
                  <p>La disponibilidad, procedencia y requisitos se confirman antes de cualquier compra.</p>
                  <a
                    className="cart-consult-button"
                    href={`mailto:hola@nidoreptiles.mx?subject=${encodeURIComponent("Consulta de disponibilidad Nido Reptiles")}&body=${encodeURIComponent(`Hola, quiero consultar la disponibilidad y los requisitos de cuidado de:\n\n${cartProducts.map((item) => `${item.name} (cantidad: ${item.quantity})`).join("\n")}\n\nSubtotal estimado: ${formatPrice(cartTotal)} MXN`)}`}
                  >
                    Consultar disponibilidad <span aria-hidden="true">↗</span>
                  </a>
                </div>
              </>
            ) : (
              <div className="cart-empty">
                <span aria-hidden="true">✳</span>
                <p>Tu bolsa está esperando una nueva compañía.</p>
                <button type="button" onClick={() => setCartOpen(false)}>Explorar serpientes</button>
              </div>
            )}
          </aside>
        </div>
      )}

      <main id="inicio">
        <section className="hero" aria-labelledby="hero-title">
          <div className="hero-copy">
            <p className="eyebrow"><span /> Una forma distinta de conectar</p>
            <h1 id="hero-title">La belleza está<br />en los detalles.</h1>
            <p className="hero-description">
              Conoce serpientes fascinantes y encuentra la compañera ideal
              para tu hogar, con orientación experta en cada paso.
            </p>
            <a className="primary-button" href="#catalogo">
              Descubre la colección <span aria-hidden="true">↘</span>
            </a>
            <span className="hero-caption">Criadas con cuidado. Acompañadas para siempre.</span>
          </div>
          <div className="hero-image">
            <Image
              src="https://images.pexels.com/photos/5140821/pexels-photo-5140821.jpeg?auto=compress&cs=tinysrgb&w=1800"
              alt="Serpiente entre las hojas de un entorno natural"
              fill
              priority
              sizes="(max-width: 620px) 100vw, 50vw"
            />
            <div className="hero-image-label">
              <span className="label-mark">N.</span>
              <span>Respeto por la naturaleza<br />en cada encuentro</span>
            </div>
            <span className="hero-index">01 / 03</span>
          </div>
          <div className="hero-side-note" aria-hidden="true">CONOCE · CUIDA · CONECTA</div>
        </section>

        <section className="collection" id="catalogo" aria-labelledby="collection-title">
          <div className="collection-heading">
            <div>
              <p className="eyebrow">Selección Nido <span className="eyebrow-line" /></p>
              <h2 id="collection-title">Serpientes</h2>
              <p className="collection-description">
                Cada una tiene su propio carácter. Encuentra la que conecte contigo.
              </p>
            </div>
            <span className="results-count">{visibleSnakes.length} compañeros extraordinarios</span>
          </div>

          <div className="catalog-toolbar">
            <span className="filter-heading">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 7h16M7 12h10m-7 5h4" />
                <circle cx="8" cy="7" r="1.5" />
                <circle cx="15" cy="12" r="1.5" />
                <circle cx="11" cy="17" r="1.5" />
              </svg>
              Filtrar y ordenar
            </span>
            <label className="sort-control">
              <span>Ordenar por:</span>
              <select value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="featured">Destacados</option>
                <option value="price-ascending">Precio: menor a mayor</option>
                <option value="price-descending">Precio: mayor a menor</option>
              </select>
            </label>
          </div>

          <div className="catalog-layout">
            <aside className="filters" aria-label="Filtros del catálogo">
              {(selectedSpecies.length > 0 || selectedExperience.length > 0 || query) && (
                <button className="clear-filters" type="button" onClick={clearFilters}>
                  Limpiar filtros <span aria-hidden="true">×</span>
                </button>
              )}
              <details className="filter-group" open>
                <summary>Especie <span className="summary-plus" aria-hidden="true">−</span></summary>
                <div className="filter-options">
                  {speciesOptions.map((species) => (
                    <label className="checkbox-option" key={species}>
                      <input
                        type="checkbox"
                        checked={selectedSpecies.includes(species)}
                        onChange={() => toggleSelection(species, selectedSpecies, setSelectedSpecies)}
                      />
                      <span>{species}</span>
                    </label>
                  ))}
                </div>
              </details>
              <details className="filter-group" open>
                <summary>Experiencia <span className="summary-plus" aria-hidden="true">−</span></summary>
                <div className="filter-options">
                  {experienceOptions.map((experience) => (
                    <label className="checkbox-option" key={experience}>
                      <input
                        type="checkbox"
                        checked={selectedExperience.includes(experience)}
                        onChange={() => toggleSelection(experience, selectedExperience, setSelectedExperience)}
                      />
                      <span>{experience}</span>
                    </label>
                  ))}
                </div>
              </details>
              <div className="care-card">
                <span className="care-card-icon" aria-hidden="true">✳</span>
                <p className="care-card-title">¿Primera serpiente?</p>
                <p>Te ayudamos a preparar su espacio y entender sus cuidados.</p>
                <a href="#cuidados">Conoce lo esencial <span aria-hidden="true">→</span></a>
              </div>
            </aside>

            <div className="product-area">
              <div className="product-grid">
                {visibleSnakes.map((snake) => (
                  <article className="product-card" key={snake.id}>
                    <div className="product-image">
                      <Image
                        src={snake.image}
                        alt={snake.alt}
                        fill
                        sizes="(max-width: 620px) 46vw, (max-width: 950px) 38vw, 24vw"
                      />
                      {snake.badge && <span className="product-badge">{snake.badge}</span>}
                      <button
                        className="favorite-button"
                        type="button"
                        aria-label={`Guardar ${snake.name} en favoritos`}
                        onClick={() => toggleFavorite(snake)}
                        aria-pressed={favoriteIds.includes(snake.id)}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M20.8 8.8c0 5.1-8.8 10.2-8.8 10.2S3.2 13.9 3.2 8.8A4.5 4.5 0 0 1 12 6.4a4.5 4.5 0 0 1 8.8 2.4Z" />
                        </svg>
                      </button>
                      <button className="quick-add" type="button" onClick={() => addToCart(snake)}>
                        Añadir a la bolsa <span aria-hidden="true">+</span>
                      </button>
                    </div>
                    <div className="product-info">
                      <div>
                        <p className="product-species">{snake.species}</p>
                        <h3>{snake.name}</h3>
                        <p className="product-morph">{snake.morph}</p>
                      </div>
                      <p className="product-price">{formatPrice(snake.price)} <span>MXN</span></p>
                    </div>
                  </article>
                ))}
              </div>
              {visibleSnakes.length === 0 && (
                <div className="empty-state">
                  <span aria-hidden="true">✳</span>
                  <h3>No encontramos coincidencias</h3>
                  <p>Prueba otra búsqueda o elimina algunos filtros.</p>
                  <button type="button" onClick={clearFilters}>Ver todas las serpientes</button>
                </div>
              )}
              {visibleSnakes.length > 0 && (
                <p className="catalog-footnote">
                  Mostrando {visibleSnakes.length} de {snakes.length} ejemplares de la colección
                </p>
              )}
            </div>
          </div>
        </section>

        <section className="care-banner" id="cuidados">
          <div className="care-banner-mark" aria-hidden="true">N.</div>
          <div>
            <p className="eyebrow">Una compañía, un compromiso</p>
            <h2>El cuidado también<br />forma parte de la elección.</h2>
          </div>
          <div className="care-banner-copy">
            <p>Antes de dar el siguiente paso, conoce su hábitat, alimentación y necesidades. Nuestro equipo puede orientarte.</p>
            <a href="mailto:hola@nidoreptiles.mx">Hablemos de cuidados <span aria-hidden="true">↗</span></a>
          </div>
        </section>
      </main>

      <footer className="site-footer" id="nosotros">
        <a className="wordmark footer-wordmark" href="#inicio">
          <span className="wordmark-symbol" aria-hidden="true">N</span>
          <span className="wordmark-text">NIDO<span>REPTILES</span></span>
        </a>
        <p>Encuentros responsables. Cuidados para toda la vida.</p>
        <span>© 2026 Nido Reptiles</span>
      </footer>
      <p className="legal-note">
        Catálogo demostrativo. La disponibilidad y cualquier traslado dependen de la legislación aplicable y de confirmar condiciones de bienestar, procedencia y documentación con un especialista.
      </p>
      <p className="screen-reader-status" role="status" aria-live="polite">{notice}</p>
      <p>Proyecto final de la materia Ingeniería de software - David Garcia Magallon - 219713849</p>
    </>
  );
}
