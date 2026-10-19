const contenedor = document.getElementById('contenido-panel');

const NOMBRES_SERVICIO = {
  'creacion-web': 'Creación de Páginas Web',
  'administracion-web': 'Administración Web',
  'mejora-web': 'Mejora de Páginas Existentes',
  'estrategia-conexion': 'Estrategia y Conexión'
};
const NOMBRES_ESTADO = {
  'pendiente': 'Pendiente',
  'en-proceso': 'En proceso',
  'activo': 'Activo',
  'finalizado': 'Finalizado'
};

// Los 5 pasos del proceso (mismos textos de "Así trabajamos contigo" en el index)
const PASOS = [
  { titulo: 'Analizamos', descripcion: 'Entendemos tu club o iniciativa y tus objetivos.' },
  { titulo: 'Diseñamos', descripcion: 'Creamos una propuesta personalizada alineada a tu identidad.' },
  { titulo: 'Desarrollamos', descripcion: 'Construimos tu sitio web con tecnología de alto rendimiento.' },
  { titulo: 'Lanzamos', descripcion: 'Publicamos tu página y la dejamos lista para destacar.' },
  { titulo: 'Administramos', descripcion: 'Mantenemos y optimizamos tu sitio para que siempre esté al 100%.' }
];

// Devuelve 'completado', 'actual' o 'pendiente' para un paso (1 a 5)
function estadoPaso(numero, c) {
  if (c.estado === 'finalizado') return 'completado';
  if (c.estado === 'pendiente') return 'pendiente';
  if (numero < c.etapa) return 'completado';
  if (numero === c.etapa) return 'actual';
  return 'pendiente';
}

// Frase corta que acompaña al título de la tarjeta
function mensajeProgreso(c) {
  if (c.estado === 'finalizado') return '¡Tu proyecto está finalizado! 🎉';
  if (c.estado === 'pendiente') return 'Recibimos tu solicitud. Pronto empezamos con el análisis.';
  return `Etapa ${c.etapa} de 5: ${PASOS[c.etapa - 1].titulo}`;
}

// Convierte el array PASOS en el HTML de la tarjeta
function pintarProgreso(c) {
  const pasos = PASOS.map((paso, i) => {
    const numero = i + 1;
    const estado = estadoPaso(numero, c);

    return `
      <li class="paso-progreso ${estado}" ${estado === 'actual' ? 'aria-current="step"' : ''}>
        <span class="marca-progreso">${estado === 'completado' ? '✓' : numero}</span>
        <div class="texto-progreso">
          <h4>${paso.titulo}</h4>
          <p>${paso.descripcion}</p>
        </div>
      </li>`;
  }).join('');

  return `
    <article class="tarjeta-panel tarjeta-progreso">
      <div class="cabecera-progreso">
        <h3>Progreso de tu proyecto</h3>
        <span class="resumen-progreso">${mensajeProgreso(c)}</span>
      </div>
      <ol class="lista-progreso">${pasos}</ol>
    </article>`;
}

const escapar = (texto) =>
  texto.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

async function cerrarSesion() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    window.location.href = 'index.html';
  }
}
document.getElementById('btnSalir').addEventListener('click', cerrarSesion);

// Función central de peticiones: la cookie viaja sola, no hay que añadir nada
async function api(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status === 401) {                 // sin sesión o sesión vencida
    window.location.replace('acceso.html');
    throw new Error('Sesión expirada');
  }
  if (res.status === 204) return null;

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error');
  return json;
}

// Genera el HTML del desplegable personalizado
const opcionesServicio = (actual) =>
  Object.entries(NOMBRES_SERVICIO)
    .map(([valor, nombre]) => `
      <li class="select-opcion" role="option" data-valor="${valor}"
          aria-selected="${valor === actual}">${nombre}</li>`)
    .join('');

function pintarPanel(c) {
  const mensajeWA = encodeURIComponent(
    `Hola SporTech, soy ${c.nombre} y quiero hablar sobre mi servicio: ${NOMBRES_SERVICIO[c.servicio]}`
  );
  const desde = new Date(c.createdAt).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  contenedor.innerHTML = `
    <h1>Hola, ${escapar(c.nombre)} 👋</h1>
    ${pintarProgreso(c)}

    <div class="grid-panel">
      <article class="tarjeta-panel">
        <h3>Tu servicio</h3>
        <p class="dato-grande">${NOMBRES_SERVICIO[c.servicio]}</p>
        <span class="badge badge-${c.estado}">${NOMBRES_ESTADO[c.estado]}</span>
      </article>

      <article class="tarjeta-panel">
        <h3>Tu cuenta</h3>
        <p>${escapar(c.email)}</p>
        <small>Cliente desde ${desde}</small>
      </article>

      <article class="tarjeta-panel acciones">
        <h3>Acciones</h3>
                <a class="btn-primario" target="_blank" rel="noopener noreferrer"
           href="https://wa.me/573235176563?text=${mensajeWA}">Escribir por WhatsApp</a>

        ${c.rol === 'admin' ? '<a class="btn-secundario" href="admin.html">Administrar clientes</a>' : ''}

        <form id="formServicio" class="form-servicio">
          <div class="select-custom" id="selectServicio">
            <input type="hidden" name="servicio" value="${c.servicio}">
            <button type="button" class="select-boton" aria-haspopup="listbox" aria-expanded="false">
              <span class="select-valor">${NOMBRES_SERVICIO[c.servicio]}</span>
              <svg class="select-flecha" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                   viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                   stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>
            </button>
            <ul class="select-lista" role="listbox">
              ${opcionesServicio(c.servicio)}
            </ul>
          </div>
          <button type="submit" class="btn-secundario" disabled>Guardar</button>
        </form>

        <button id="btnEliminar" class="btn-peligro">Eliminar cuenta</button>
      </article>
    </div>
  `;

  // Los listeners se agregan DESPUÉS de pintar, porque innerHTML recrea los elementos
  const formServicio = document.getElementById('formServicio');
  const btnGuardar = formServicio.querySelector('button[type="submit"]');

  // "Guardar" solo se habilita si el servicio elegido es distinto al actual
  activarSelect(document.getElementById('selectServicio'), (valor) => {
    btnGuardar.disabled = valor === c.servicio;
  });

  formServicio.addEventListener('submit', async (e) => {
    e.preventDefault();
    const servicio = new FormData(formServicio).get('servicio');
    try {
      const actualizado = await api('/api/clientes/me', {
        method: 'PUT',
        body: JSON.stringify({ servicio })
      });
      pintarPanel(actualizado);
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('btnEliminar').addEventListener('click', async () => {
    if (!confirm('¿Seguro que quieres eliminar tu cuenta? No se puede deshacer.')) return;
    try {
      await api('/api/clientes/me', { method: 'DELETE' });
      window.location.href = 'index.html';   // el servidor ya borró la cookie
    } catch (err) {
      alert(err.message);
    }
  });
}

async function cargarPanel() {
  try {
    const cliente = await api('/api/clientes/me');
    pintarPanel(cliente);
  } catch (err) {
    contenedor.innerHTML = `<p class="mensaje error">${escapar(err.message)}</p>`;
  }
}
cargarPanel();