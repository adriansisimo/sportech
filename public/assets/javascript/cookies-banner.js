(function () {
  const CLAVE = 'sportech-aviso-cookies';

  // Si ya lo aceptó antes, no se muestra
  try {
    if (localStorage.getItem(CLAVE)) return;
  } catch { /* si el navegador bloquea localStorage, igual mostramos el aviso */ }

  const banner = document.createElement('div');
  banner.className = 'banner-cookies';
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Aviso de cookies');
  banner.innerHTML = `
    <p>🍪 Usamos <strong>una sola cookie</strong>, esencial y segura, para mantener tu sesión
    iniciada. No la usamos para publicidad ni para rastrearte. Servicios de terceros incrustados
    en la página (como Google Maps y Google Fonts) pueden aplicar sus propias políticas.</p>
    <button type="button" class="btn-cookies">Entendido</button>
  `;
  document.body.appendChild(banner);

  banner.querySelector('.btn-cookies').addEventListener('click', () => {
    try { localStorage.setItem(CLAVE, 'si'); } catch { /* ignorar */ }
    banner.classList.add('saliendo');
    banner.addEventListener('animationend', () => banner.remove());
  });
})();