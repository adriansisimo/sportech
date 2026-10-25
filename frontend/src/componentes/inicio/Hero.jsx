export default function Hero() {
  return (
    <section id="inicio">
      <div className="texto-inicio">
        <span>Diseño, administración y mejora de páginas web</span>
        <h2>Impulsamos <i>clubes.</i></h2>
        <h2>Conectamos <i>pasiones.</i></h2>
        <p>
          Creamos, administramos y mejoramos páginas web de clubes y personas del medio digital
          que impulsen el mundo de los buenos hábitos y la vida saludable.
        </p>
        <div className="botones-inicio">
          <a className="btn-servicios" href="#servicios">Conoce nuestros servicios</a>
          <a className="btn-nosotros" href="#nosotros">¿Quién es SporTech?</a>
        </div>
      </div>

      <div className="imagen-inicio">
        <img src="/img/inicio-img.png" alt="Imagen de inicio SporTech" />
        <span>"El futuro del deporte y la digitalización están en nuestro corazón."</span>
      </div>
    </section>
  );
}