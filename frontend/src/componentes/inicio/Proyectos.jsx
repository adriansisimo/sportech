const PROYECTOS = [
  { nombre: 'Club Deportivo Alameda', foto: '32424863' },
  { nombre: 'Fuerza Total Box', foto: '32610333' },
  { nombre: 'Corredores del Pacífico', foto: '19148584' },
  { nombre: 'Academia Impulso Basket', foto: '8336951' }
];

const urlFoto = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&h=627&fit=crop&w=1200`;

export default function Proyectos() {
  return (
    <section id="proyectos">
      <div className="proyectos-header">
        <span className="etiqueta-proyectos">Proyectos</span>
        <h2>Proyectos que nos motivan</h2>
        <span className="subtitulo-proyectos">
          Hemos trabajado con clubes e iniciativas que comparten nuestra pasión.
        </span>
      </div>

      <div className="grid-proyectos">
        {PROYECTOS.map((p) => (
          <article key={p.foto} className="tarjeta-proyecto">
            <img src={urlFoto(p.foto)} alt={p.nombre} />
            <p>{p.nombre}</p>
          </article>
        ))}
      </div>

      <div className="btn-ver-proyectos">
        <a href="#contacto">Ver más proyectos</a>
      </div>
    </section>
  );
}