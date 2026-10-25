// Petición "pura": no redirige. No asume que la respuesta sea JSON.
export async function peticion(url, opciones = {}) {
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

// Para páginas con sesión: si falla la sesión, redirige.
export async function api(url, opciones = {}) {
  try {
    return await peticion(url, opciones);
  } catch (err) {
    if (err.status === 401) {
      window.location.replace('/acceso');
      throw new Error('Sesión expirada');
    }
    if (err.status === 403 && !window.location.pathname.startsWith('/panel')) {
      window.location.replace('/panel');
      throw new Error('Acceso restringido');
    }
    throw err;
  }
}

export async function cerrarSesion(destino = '/') {
  try {
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' });
  } finally {
    window.location.href = destino;
  }
}