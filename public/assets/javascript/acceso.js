const tabs = document.querySelectorAll('.tab');
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensajeAcceso');

// Si ya hay sesión, no tiene sentido mostrar el login
if (localStorage.getItem('token')) {
  window.location.replace('panel.html');
}

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;          // textContent (no innerHTML) = seguro contra inyección
  mensaje.className = `mensaje ${tipo}`;
  mensaje.hidden = false;
}

// Alternar entre las pestañas
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.remove('active'));
    tab.classList.add('active');
    formLogin.hidden = tab.dataset.form !== 'formLogin';
    formRegistro.hidden = tab.dataset.form !== 'formRegistro';
    mensaje.hidden = true;
  });
});

// Función reutilizable: manda un POST con JSON y devuelve la respuesta
async function enviar(url, datos) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datos)
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error || 'Algo salió mal');
  return json;
}

// Un solo manejador para ambos formularios
function manejar(form, url) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();                                   // evita que la página recargue
    const datos = Object.fromEntries(new FormData(form)); // {email:'..', password:'..'}
    try {
      const { token } = await enviar(url, datos);
      localStorage.setItem('token', token);
      window.location.href = 'panel.html';
    } catch (err) {
      mostrarMensaje(err.message, 'error');
    }
  });
}

manejar(formLogin, '/api/auth/login');
manejar(formRegistro, '/api/auth/registro');