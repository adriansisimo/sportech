import { PASOS } from '../constantes';

// Devuelve 'completado', 'actual' o 'pendiente' para un paso (1 a 5)
function estadoPaso(numero, c) {
  if (c.estado === 'finalizado') return 'completado';
  if (c.estado === 'pendiente') return 'pendiente';
  if (numero < c.etapa) return 'completado';
  if (numero === c.etapa) return 'actual';
  return 'pendiente';
}

function mensajeProgreso(c) {
  if (c.estado === 'finalizado') return '¡Tu proyecto está finalizado! 🎉';
  if (c.estado === 'pendiente') return 'Recibimos tu solicitud. Pronto empezamos con el análisis.';
  return `Etapa ${c.etapa} de 5: ${PASOS[c.etapa - 1].titulo}`;
}

export default function Progreso({ cliente }) {
  return (
    <article className="tarjeta-panel tarjeta-progreso">
      <div className="cabecera-progreso">
        <h3>Progreso de tu proyecto</h3>
        <span className="resumen-progreso">{mensajeProgreso(cliente)}</span>
      </div>

      <ol className="lista-progreso">
        {PASOS.map((paso, i) => {
          const numero = i + 1;
          const estado = estadoPaso(numero, cliente);
          return (
            <li key={paso.titulo} className={`paso-progreso ${estado}`}
                aria-current={estado === 'actual' ? 'step' : undefined}>
              <span className="marca-progreso">{estado === 'completado' ? '✓' : numero}</span>
              <div className="texto-progreso">
                <h4>{paso.titulo}</h4>
                <p>{paso.descripcion}</p>
              </div>
            </li>
          );
        })}
      </ol>
    </article>
  );
}