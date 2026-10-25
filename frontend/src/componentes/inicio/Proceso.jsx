import { Search, Lightbulb, CodeXml, Rocket, ChartNoAxesCombined } from 'lucide-react';
import { PASOS } from '../../constantes';

const ICONOS = [Search, Lightbulb, CodeXml, Rocket, ChartNoAxesCombined];

export default function Proceso() {
  return (
    <section id="proceso">
      <span className="etiqueta-proceso">Nuestro proceso</span>
      <h2>Así trabajamos contigo</h2>

      <div className="pasos-proceso">
        {PASOS.map((paso, i) => {
          const Icono = ICONOS[i];
          return (
            <article key={paso.titulo} className="paso">
              <div className="icono-paso"><Icono /></div>
              <h3>{i + 1}. {paso.titulo}</h3>
              <p>{paso.descripcion}</p>
            </article>
          );
        })}
      </div>
    </section>
  );
}