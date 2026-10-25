import { MapPin, Users, SmilePlus, Quote } from 'lucide-react';

export default function Nosotros() {
  return (
    <section id="nosotros">
      <div className="contenido-nosotros">
        <div className="texto-nosotros">
          <h2>Pasión por el deporte, pasión por la tecnología</h2>
          <span id="text-nosotros">
            SporTech nace en Cali, con la misión de apoyar al deporte y a quienes inspiran a otros
            a través de él. Combinamos diseño, tecnología y estrategia para crear soluciones
            digitales que generen impacto real. Porque creemos en que la tecnología y el deporte
            pueden transformar la vida de las personas y el mundo en general, y es nuestro deber
            impulsarlos.
          </span>

          <div className="mini-tarjetas">
            <article className="tarjetas">
              <a href="https://maps.app.goo.gl/g9ii2JE6sMGkfmMi8" target="_blank"
                 rel="noopener noreferrer" aria-label="Ver Cali en el mapa">
                <MapPin />
              </a>
              <div className="info-tarjeta">
                <p>Cali, Colombia</p>
                <span>Nuestro punto de partida.</span>
              </div>
            </article>

            <article className="tarjetas">
              <Users />
              <div className="info-tarjeta">
                <p>Clientes</p>
                <span>en todo el país y el mundo.</span>
              </div>
            </article>

            <article className="tarjetas">
              <SmilePlus strokeWidth={2.75} />
              <div className="info-tarjeta">
                <p>Impacto Positivo</p>
                <span>en el deporte, salud y comunidad.</span>
              </div>
            </article>
          </div>
        </div>

        <div className="nosotros-img-leyend">
          <img src="/img/sportech.png" alt="Imagen de nosotros SporTech" />
          <div className="cita-nosotros">
            <Quote className="icono-cita" />
            <p>Creemos en el poder del deporte para transformar vidas. Y en la tecnología para llevar ese mensaje más lejos.</p>
          </div>
        </div>
      </div>
    </section>
  );
}