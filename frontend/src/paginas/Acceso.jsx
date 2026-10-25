import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PaginaInterna from '../componentes/PaginaInterna';
import { peticion } from '../api';
import { NOMBRES_SERVICIO } from '../constantes';

export default function Acceso() {
  const [pestana, setPestana] = useState('login');   // 'login' o 'registro'
  const [mensaje, setMensaje] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const navigate = useNavigate();

  // Si ya hay sesión, directo al panel
  useEffect(() => {
    peticion('/api/auth/sesion')
      .then(({ autenticado }) => {
        if (autenticado) navigate('/panel', { replace: true });
      })
      .catch(() => {});
  }, [navigate]);

  function cambiarPestana(nueva) {
    setPestana(nueva);
    setMensaje(null);
  }

  async function enviar(e, url) {
    e.preventDefault();
    const datos = Object.fromEntries(new FormData(e.currentTarget));
    setEnviando(true);
    try {
      await peticion(url, { method: 'POST', body: JSON.stringify(datos) });
      navigate('/panel');
    } catch (err) {
      setMensaje(err.message);
      setEnviando(false);
    }
  }

  return (
    <PaginaInterna barra={<Link className="enlace-barra" to="/">← Volver al inicio</Link>}>
      <div className="tarjeta-acceso">
        <div className="tabs">
          <button type="button" className={`tab ${pestana === 'login' ? 'active' : ''}`}
                  onClick={() => cambiarPestana('login')}>Ingresar</button>
          <button type="button" className={`tab ${pestana === 'registro' ? 'active' : ''}`}
                  onClick={() => cambiarPestana('registro')}>Crear cuenta</button>
        </div>

        <form className={`form-acceso ${pestana === 'login' ? 'activo' : ''}`}
              onSubmit={(e) => enviar(e, '/api/auth/login')}>
          <input type="email" name="email" placeholder="Correo electrónico" required />
          <input type="password" name="password" placeholder="Contraseña" required />
          <button type="submit" className="btn-primario" disabled={enviando}>Ingresar</button>
        </form>

        <form className={`form-acceso ${pestana === 'registro' ? 'activo' : ''}`}
              onSubmit={(e) => enviar(e, '/api/auth/registro')}>
          <input type="text" name="nombre" placeholder="Nombre completo" required />
          <input type="email" name="email" placeholder="Correo electrónico" required />
          <input type="password" name="password" placeholder="Contraseña (mín. 6 caracteres)"
                 minLength={6} required />
          <select name="servicio" defaultValue="" required>
            <option value="" disabled>¿Qué servicio necesitas?</option>
            {Object.entries(NOMBRES_SERVICIO).map(([valor, nombre]) => (
              <option key={valor} value={valor}>{nombre}</option>
            ))}
          </select>
          <button type="submit" className="btn-primario" disabled={enviando}>Crear cuenta</button>
        </form>

        {mensaje && <p className="mensaje error">{mensaje}</p>}
      </div>
    </PaginaInterna>
  );
}