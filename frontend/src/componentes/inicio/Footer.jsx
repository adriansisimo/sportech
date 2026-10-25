export default function Footer() {
  return (
    <footer>
      <div className="footer-marca">
        <h2>Spor<span className="titulo-tech">Tech</span></h2>
        <small>Tecnología que impulsa el deporte.</small>
        <div className="redes">
          <a href="https://www.instagram.com/a.adri_an/" target="_blank" rel="noopener noreferrer"
             className="icono-red icono-instagram" aria-label="Instagram"></a>
          <a href="https://www.facebook.com/adrian.033109/" target="_blank" rel="noopener noreferrer"
             className="icono-red icono-facebook" aria-label="Facebook"></a>
          <a href="https://www.tiktok.com/@a.adri_an?_r=1&t=ZS-98g3Mil2ZLF" target="_blank"
             rel="noopener noreferrer" className="icono-red icono-tiktok" aria-label="TikTok"></a>
        </div>
      </div>

      <div className="nav-footer">
        <nav>
          <h3>NAVEGACIÓN</h3>
          <ul>
            <li><a href="#inicio">Inicio</a></li>
            <li><a href="#servicios">Servicios</a></li>
            <li><a href="#nosotros">Nosotros</a></li>
            <li><a href="#contacto">Contacto</a></li>
          </ul>
        </nav>
        <nav>
          <h3>SERVICIOS</h3>
          <ul>
            <li><a href="#servicios">Creación de Páginas Web</a></li>
            <li><a href="#servicios">Administración Web</a></li>
            <li><a href="#servicios">Mejora de Páginas Existentes</a></li>
            <li><a href="#servicios">Estrategia y Conexión</a></li>
          </ul>
        </nav>
      </div>

      <p className="copyright-footer">&copy; 2026 SporTech - Todos los derechos reservados.</p>
    </footer>
  );
}