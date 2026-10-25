const tabs = document.querySelectorAll('.tab');
const formLogin = document.getElementById('formLogin');
const formRegistro = document.getElementById('formRegistro');
const mensaje = document.getElementById('mensajeAcceso');

// Si ya hay sesión, directo al panel
peticion('/api/auth/sesion')
  .then(({ autenticado }) => {
    if (autenticado) window.location.replace('panel.html');
  })
  .catch(() => {});

function mostrarMensaje(texto, tipo) {
  mensaje.textContent = texto;
  mensaje.className = `mensaje ${tipo}`;
  mensaje.hidden = false;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    tabs.forEach((t) => t.classList.toggle('active', t === tab));
    formLogin.classList.toggle('activo', tab.dataset.form === 'formLogin');
    formRegistro.classList.toggle('activo', tab.dataset.form === 'formRegistro');
    mensaje.hidden = true;
  });
});

const enviar = (url, datos) =>
  peticion(url, { method: 'POST', body: JSON.stringify(datos) });

function manejar(form, url) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(form));
    try {
      await enviar(url, datos);          // el servidor deja la cookie; no hay nada que guardar aquí
      window.location.href = 'panel.html';
    } catch (err) {
      mostrarMensaje(err.message, 'error');
    }
  });
}

manejar(formLogin, '/api/auth/login');
manejar(formRegistro, '/api/auth/registro');