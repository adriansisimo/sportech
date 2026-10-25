// código compartido por panel.js, admin.js (y acceso.js)

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

const escapar = (texto) =>
  String(texto ?? '').replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

// mes: 'short' (ene, feb...) o 'long' (enero, febrero...)
const formatearFecha = (fecha, mes = 'short') =>
  new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: mes, year: 'numeric' });

// Petición "pura": no redirige a ningún lado. No asume que la respuesta sea JSON
// (así un 404 en texto plano, como el de Vercel, ya no revienta con "Unexpected token").
async function peticion(url, opciones = {}) {
  const res = await fetch(url, {
    ...opciones,
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' }
  });

  if (res.status === 204) return null;

  const esJson = (res.headers.get('content-type') || '').includes('application/json');
  const json = esJson ? await res.json() : null;

  if (!res.ok) {
    const error = new Error(json?.error || `El servidor respondió con error ${res.status}`);
    error.status = res.status;
    throw error;
  }
  if (!esJson) throw new Error('El servidor no respondió con datos válidos');
  return json;
}

// Petición para páginas con sesión: si la sesión falla, redirige.
async function api(url, opciones = {}) {
  try {
    return await peticion(url, opciones);
  } catch (err) {
    if (err.status === 401) {                    // sin sesión o sesión vencida
      window.location.replace('acceso.html');
      throw new Error('Sesión expirada');
    }
    // con sesión, pero no es admin (el if evita un bucle si ya estás en panel.html)
    if (err.status === 403 && !window.location.pathname.endsWith('panel.html')) {
      window.location.replace('panel.html');
      throw new Error('Acceso restringido');
    }
    throw err;
  }
}

async function cerrarSesion() {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    window.location.href = 'index.html';
  }
}
document.getElementById('btnSalir')?.addEventListener('click', cerrarSesion);