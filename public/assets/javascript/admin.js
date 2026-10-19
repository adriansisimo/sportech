const tbody = document.getElementById('tbodyClientes');
const resumen = document.getElementById('resumen');
const inputBusqueda = document.getElementById('busqueda');
const filtroEstado = document.getElementById('filtroEstado');
const aviso = document.getElementById('aviso');

// ===== DATOS =====
// "clientes" es el array con TODO lo que dijo el servidor. Cada vez que cambia algo,
// actualizamos este array y volvemos a pintar. Así la pantalla siempre refleja los datos.
let clientes = [];
let miId = null; // mi propio id, para no mostrarme el botón de eliminar

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
const NOMBRES_ETAPA = {
  1: '1. Analizamos',
  2: '2. Diseñamos',
  3: '3. Desarrollamos',
  4: '4. Lanzamos',
  5: '5. Administramos'
};

// ===== UTILIDADES =====
const escapar = (texto) =>
  texto.replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

// Convierte un diccionario en <option>s. "actual" es el valor que queda seleccionado.
const opciones = (diccionario, actual) =>
  Object.entries(diccionario)
    .map(([valor, nombre]) =>
      `<option value="${valor}" ${valor === String(actual) ? 'selected' : ''}>${nombre}</option>`)
    .join('');

let temporizadorAviso;
function avisar(texto, tipo) {
  aviso.textContent = texto;
  aviso.className = `mensaje toast ${tipo}`;
  aviso.hidden = false;
  clearTimeout(temporizadorAviso);                       // si había uno pendiente, lo cancelamos
  temporizadorAviso = setTimeout(() => { aviso.hidden = true; }, 3000);
}

async function cerrarSesion() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    window.location.href = 'index.html';
  }
}
document.getElementById('btnSalir').addEventListener('click', cerrarSesion);

async function api(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status === 401) {                    // sin sesión
    window.location.replace('acceso.html');
    throw new Error('Sesión expirada');
  }
  if (res.status === 403) {                    // con sesión, pero no es admin
    window.location.replace('panel.html');
    throw new Error('Acceso restringido');
  }
  if (res.status === 204) return null;

  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Error');
  return json;
}

// ===== PINTAR =====

// 1) Tarjetas de resumen: contamos con .filter() y mostramos el número
function pintarResumen() {
  const contar = (estado) => clientes.filter((c) => c.estado === estado).length;

  const tarjetas = [
    ['Total', clientes.length],
    ['Pendientes', contar('pendiente')],
    ['En proceso', contar('en-proceso')],
    ['Activos', contar('activo')],
    ['Finalizados', contar('finalizado')]
  ];

  resumen.innerHTML = tarjetas
    .map(([titulo, numero]) => `
      <article class="tarjeta-panel">
        <h3>${titulo}</h3>
        <p class="numero-grande">${numero}</p>
      </article>`)
    .join('');
}

// 2) Filtrado: devuelve un array NUEVO con solo los clientes que coinciden
function clientesFiltrados() {
  const texto = inputBusqueda.value.trim().toLowerCase();
  const estado = filtroEstado.value;

  return clientes.filter((c) =>
    (estado === 'todos' || c.estado === estado) &&
    (c.nombre.toLowerCase().includes(texto) || c.email.includes(texto))
  );
}

// 3) Tabla: cada cliente del array se convierte en una fila <tr>
function pintarTabla() {
  const lista = clientesFiltrados();

  if (lista.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="tabla-vacia">No hay clientes que coincidan.</td></tr>`;
    return;
  }

  tbody.innerHTML = lista
    .map((c) => {
      const esYo = c._id === miId;
      const fecha = new Date(c.createdAt).toLocaleDateString('es-CO', {
        day: 'numeric', month: 'short', year: 'numeric'
      });

      return `
        <tr data-id="${c._id}">
          <td>
            <strong>${escapar(c.nombre)}</strong>${esYo ? ' <span class="etiqueta-tu">tú</span>' : ''}<br>
            <small>${escapar(c.email)}</small>
          </td>
          <td>${NOMBRES_SERVICIO[c.servicio]}</td>
          <td><select data-campo="estado">${opciones(NOMBRES_ESTADO, c.estado)}</select></td>
          <td><select data-campo="etapa">${opciones(NOMBRES_ETAPA, c.etapa)}</select></td>
          <td>${fecha}</td>
          <td>${esYo ? '' : '<button class="btn-tabla-peligro" data-accion="eliminar">Eliminar</button>'}</td>
        </tr>`;
    })
    .join('');
}

// ===== EVENTOS =====
// Delegación de eventos: en vez de poner un listener en CADA select (que se destruyen
// cada vez que repintamos), ponemos UNO en el <tbody>, que nunca se destruye.
// e.target nos dice qué elemento exacto recibió el cambio.

tbody.addEventListener('change', async (e) => {
  const select = e.target.closest('select[data-campo]');
  if (!select) return;

  const id = select.closest('tr').dataset.id;     // sale del data-id de la fila
  const campo = select.dataset.campo;              // "estado" o "etapa"
  const valor = campo === 'etapa' ? Number(select.value) : select.value;

  try {
    // [campo]: valor => la clave del objeto es dinámica: { estado: 'activo' } o { etapa: 3 }
    const actualizado = await api(`/api/admin/clientes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ [campo]: valor })
    });

    // Reemplazamos solo ese cliente en el array con la versión nueva del servidor
    clientes = clientes.map((c) => (c._id === id ? actualizado : c));
    pintarResumen();
    avisar('Cambios guardados ✓', 'ok');
  } catch (err) {
    avisar(err.message, 'error');
    pintarTabla(); // si falló, repintamos para que el select vuelva a su valor real
  }
});

tbody.addEventListener('click', async (e) => {
  const boton = e.target.closest('button[data-accion="eliminar"]');
  if (!boton) return;

  const id = boton.closest('tr').dataset.id;
  const cliente = clientes.find((c) => c._id === id);

  if (!confirm(`¿Eliminar a ${cliente.nombre}? Se borra su cuenta y no se puede deshacer.`)) return;

  try {
    await api(`/api/admin/clientes/${id}`, { method: 'DELETE' });
    clientes = clientes.filter((c) => c._id !== id);   // lo sacamos del array
    pintarResumen();
    pintarTabla();
    avisar('Cliente eliminado', 'ok');
  } catch (err) {
    avisar(err.message, 'error');
  }
});

// Filtros: cada vez que escribes o cambias el estado, solo repintamos la tabla.
// No hace falta volver a pedir nada al servidor: ya tenemos todos los datos en el array.
inputBusqueda.addEventListener('input', pintarTabla);
filtroEstado.addEventListener('change', pintarTabla);

// ===== ARRANQUE =====
async function iniciar() {
  filtroEstado.innerHTML =
    '<option value="todos">Todos los estados</option>' + opciones(NOMBRES_ESTADO, '');

  try {
    // Promise.all lanza las dos peticiones a la vez y espera a que lleguen ambas
    const [lista, yo] = await Promise.all([
      api('/api/admin/clientes'),
      api('/api/clientes/me')
    ]);
    clientes = lista;
    miId = yo._id;
    pintarResumen();
    pintarTabla();
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="6" class="tabla-vacia">${escapar(err.message)}</td></tr>`;
  }
}
iniciar();