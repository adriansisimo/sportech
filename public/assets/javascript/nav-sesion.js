const btnAcceso = document.getElementById('btn-asesoria');

// Limpieza del sistema anterior: el token ya no se guarda en localStorage.
// Puedes borrar esta línea cuando quieras.
localStorage.removeItem('token');

async function revisarSesion() {
  if (!btnAcceso) return;
  try {
    const res = await fetch('/api/auth/sesion');
    const { autenticado } = await res.json();
    if (autenticado) {
      btnAcceso.textContent = 'Mi panel';
      btnAcceso.href = 'panel.html';
    }
  } catch {
    // Si el servidor no responde, dejamos "Ingresar" y ya
  }
}

revisarSesion();