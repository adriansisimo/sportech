const token = localStorage.getItem('token');
if (!token) window.location.replace('acceso.html');

const contenedor = document.getElementById('contenido-panel');

// Diccionarios: traducen el valor "feo" de la BD a texto bonito
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

// Evita que un nombre como <script>... se ejecute al pintarlo con innerHTML
const escapar = (texto) =>
  texto.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

function cerrarSesion() {
  localStorage.removeItem('token');
  window.location.href = 'index.html';
}
document.getElementById('btnSalir').addEventListener('click', cerrarSesion);

// Función central: hace el fetch y agrega el token automáticamente
async function api(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    }
  });

  if (res.status === 401) {          // token vencido o falso
    cerrarSesion();
    throw new Error('Sesión expirada');
  }
  if (res.status === 204) return null; // DELETE no devuelve cuerpo

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error');
  return json;
}

// Convierte el servicio actual en <option>s: aquí está la magia de "array → HTML"
const opcionesServicio = (actual) =>
  Object.entries(NOMBRES_SERVICIO)
    .map(([valor, nombre]) =>
      `<option value="${valor}" ${valor === actual ? 'selected' : ''}>${nombre}</option>`)
    .join('');

// PINTAR: recibe el objeto del cliente y lo convierte en HTML
function pintarPanel(c) {
  const mensajeWA = encodeURIComponent(
    `Hola SporTech, soy ${c.nombre} y quiero hablar sobre mi servicio: ${NOMBRES_SERVICIO[c.servicio]}`
  );
  const desde = new Date(c.createdAt).toLocaleDateString('es-CO', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  contenedor.innerHTML = `
    <h1>Hola, ${escapar(c.nombre)} 👋</h1>

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

        <form id="formServicio" class="form-inline">
          <select name="servicio">${opcionesServicio(c.servicio)}</select>
          <button type="submit" class="btn-secundario">Guardar</button>
        </form>

        <button id="btnEliminar" class="btn-peligro">Eliminar cuenta</button>
      </article>
    </div>
  `;

  // Como innerHTML recrea los elementos, los listeners se agregan DESPUÉS de pintar
  document.getElementById('formServicio').addEventListener('submit', async (e) => {
    e.preventDefault();
    const servicio = new FormData(e.target).get('servicio');
    try {
      const actualizado = await api('/api/clientes/me', {
        method: 'PUT',
        body: JSON.stringify({ servicio })
      });
      pintarPanel(actualizado); // volvemos a pintar con los datos nuevos
    } catch (err) {
      alert(err.message);
    }
  });

  document.getElementById('btnEliminar').addEventListener('click', async () => {
    if (!confirm('¿Seguro que quieres eliminar tu cuenta? No se puede deshacer.')) return;
    try {
      await api('/api/clientes/me', { method: 'DELETE' });
      cerrarSesion();
    } catch (err) {
      alert(err.message);
    }
  });
}

// ARRANQUE: pedir datos (GET) y pintarlos
async function cargarPanel() {
  try {
    const cliente = await api('/api/clientes/me');
    pintarPanel(cliente);
  } catch (err) {
    contenedor.innerHTML = `<p class="mensaje error">${escapar(err.message)}</p>`;
  }
}
cargarPanel();