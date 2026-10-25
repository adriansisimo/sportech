import { useState } from 'react';

const CLAVE = 'sportech-aviso-cookies';

function yaAceptado() {
  try {
    return Boolean(localStorage.getItem(CLAVE));
  } catch {
    return false;   // si el navegador bloquea localStorage, igual mostramos el aviso
  }
}

export default function CookiesBanner() {
  const [visible, setVisible] = useState(() => !yaAceptado());
  const [saliendo, setSaliendo] = useState(false);

  function aceptar() {
    try { localStorage.setItem(CLAVE, 'si'); } catch { /* ignorar */ }
    setSaliendo(true);
  }

  if (!visible) return null;

  return (
    <div className={`banner-cookies ${saliendo ? 'saliendo' : ''}`}
         role="region" aria-label="Aviso de cookies"
         onAnimationEnd={() => saliendo && setVisible(false)}>
      <p>
        🍪 Usamos <strong>una sola cookie</strong>, esencial y segura, para mantener tu sesión
        iniciada. No la usamos para publicidad ni para rastrearte. Servicios de terceros incrustados
        en la página (como Google Maps y Google Fonts) pueden aplicar sus propias políticas.
      </p>
      <button type="button" className="btn-cookies" onClick={aceptar}>Entendido</button>
    </div>
  );
}