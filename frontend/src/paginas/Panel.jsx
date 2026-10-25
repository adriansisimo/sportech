import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PaginaInterna from '../componentes/PaginaInterna';
import Progreso from '../componentes/Progreso';
import SelectCustom from '../componentes/SelectCustom';
import { api, cerrarSesion } from '../api';
import { NOMBRES_SERVICIO, NOMBRES_ESTADO } from '../constantes';
import { formatearFecha } from '../utilidades';

export default function Panel() {
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState(null);
  const [servicioElegido, setServicioElegido] = useState('');
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    api('/api/clientes/me')
      .then((c) => {
        setCliente(c);
        setServicioElegido(c.servicio);
      })
      .catch((err) => setError(err.message));
  }, []);

  async function guardarServicio(e) {
    e.preventDefault();
    setGuardando(true);
    try {
      const actualizado = await api('/api/clientes/me', {
        method: 'PUT',
        body: JSON.stringify({ servicio: servicioElegido })
      });
      setCliente(actualizado);
      setServicioElegido(actualizado.servicio);
    } catch (err) {
      alert(err.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCuenta() {
    if (!confirm('¿Seguro que quieres eliminar tu cuenta? No se puede deshacer.')) return;
    try {
      await api('/api/clientes/me', { method: 'DELETE' });
      window.location.href = '/';   // el servidor ya borró la cookie
    } catch (err) {
      alert(err.message);
    }
  }

  const barra = (
    <button className="btn-salir" onClick={() => cerrarSesion()}>Cerrar sesión</button>
  );

  return (
    <PaginaInterna barra={barra}>
      <div className="contenedor-panel">
        {error && <p className="mensaje error">{error}</p>}
        {!cliente && !error && <p>Cargando tu información...</p>}

        {cliente && (
          <>
            <h1>Hola, {cliente.nombre} 👋</h1>
            <Progreso cliente={cliente} />

            <div className="grid-panel">
              <article className="tarjeta-panel">
                <h3>Tu servicio</h3>
                <p className="dato-grande">{NOMBRES_SERVICIO[cliente.servicio]}</p>
                <span className={`badge badge-${cliente.estado}`}>{NOMBRES_ESTADO[cliente.estado]}</span>
              </article>

              <article className="tarjeta-panel">
                <h3>Tu cuenta</h3>
                <p>{cliente.email}</p>
                <small>Cliente desde {formatearFecha(cliente.createdAt, 'long')}</small>
              </article>

              <article className="tarjeta-panel acciones">
                <h3>Acciones</h3>
                <a className="btn-primario" target="_blank" rel="noopener noreferrer"
                   href={`https://wa.me/573235176563?text=${encodeURIComponent(
                     `Hola SporTech, soy ${cliente.nombre} y quiero hablar sobre mi servicio: ${NOMBRES_SERVICIO[cliente.servicio]}`
                   )}`}>
                  Escribir por WhatsApp
                </a>

                {cliente.rol === 'admin' && (
                  <Link className="btn-secundario" to="/admin">Administrar clientes</Link>
                )}

                <form className="form-servicio" onSubmit={guardarServicio}>
                  <SelectCustom opciones={NOMBRES_SERVICIO} valor={servicioElegido}
                                onChange={setServicioElegido} />
                  <button type="submit" className="btn-secundario"
                          disabled={servicioElegido === cliente.servicio || guardando}>
                    Guardar
                  </button>
                </form>

                <button className="btn-peligro" onClick={eliminarCuenta}>Eliminar cuenta</button>
              </article>
            </div>
          </>
        )}
      </div>
    </PaginaInterna>
  );
}