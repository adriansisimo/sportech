const TARJETAS = [
  {
    clase: 'tarjeta-creacion', titulo: 'Creación de Páginas Web',
    texto: 'Diseñamos sitios web modernos, profesionales, atractivos y enfocados en convertir visitantes en seguidores, clientes potenciales y miembros.',
    icono: 'website.svg', alt: 'Icono Página Web'
  },
  {
    clase: 'tarjeta-admon', titulo: 'Administración Web',
    texto: 'Nos encargamos del contenido, actualizaciones, seguridad, mantenimiento y rendimiento para que tú te enfoques en lo importante.',
    icono: 'config.svg', alt: 'Icono Configuración Web'
  },
  {
    clase: 'tarjeta-mejora', titulo: 'Mejora de Páginas Existentes',
    texto: 'Optimizamos tu sitio actual para hacerlo más eficiente, atractivo y funcional.',
    icono: 'arrow.svg', alt: 'Icono Mejora Web'
  },
  {
    clase: 'tarjeta-estrategia', titulo: 'Estrategia y Conexión',
    texto: 'Integramos herramientas que fortalecen tu comunidad y promueven hábitos saludables.',
    icono: 'crowd.svg', alt: 'Icono Comunidad'
  }
];

export default function Servicios() {
  return (
    <>
      <section id="servicios">
        <h2>Soluciones digitales para el mundo del deporte</h2>
        <span>
          Ayudamos a clubes e iniciativas a tener una presencia digital profesional, efectiva y
          orientada a los resultados.
        </span>
      </section>

      <section className="tarjetas">
        {TARJETAS.map((t) => (
          <article key={t.clase} className={t.clase}>
            <h3>{t.titulo}</h3>
            <p>{t.texto}</p>
            <img src={`/img/${t.icono}`} alt={t.alt} />
          </article>
        ))}
      </section>
    </>
  );
}