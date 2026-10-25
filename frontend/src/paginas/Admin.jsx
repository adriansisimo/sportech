import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import PaginaInterna from '../componentes/PaginaInterna';
import { api, cerrarSesion } from '../api';
import { NOMBRES_SERVICIO, NOMBRES_ESTADO, NOMBRES_ETAPA } from '../constantes';
import { formatearFecha } from '../utilidades';

// Convierte un diccionario en <option>s
const opcionesDe = (diccionario) =>
  Object.entries(diccionario).map(([valor, nombre]) => (
    <option key={valor} value={valor}>{nombre}</option>
  ));

export default function Admin() {
  const [clientes, setClientes] = useState([]);
  const [miId, setMiId] = useState(null);       // para no mostrarme el botón de eliminar
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos');
  const [aviso, setAviso] = useState(null);     // { texto, tipo } o null
  const temporizador = useRef(null);

  function avisar(texto, tipo) {
    setAviso({ texto, tipo });
    clearTimeout(temporizador.current);          // si había uno pendiente, lo cancelamos
    temporizador.current = setTimeout(() => setAviso(null), 3000);
  }
  useEffect(() => () => clearTimeout(temporizador.current), []);

  // Carga inicial: las dos peticiones a la vez
  useEffect(() => {
    Promise.all([api('/api/admin/clientes'), api('/api/clientes/me')])
      .then(([lista, yo]) => {
        setClientes(lista);
        setMiId(yo._id);
      })
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  async function actualizar(id, campo, valor) {
    try {
      // [campo]: valor => { estado: 'activo' } o { etapa: 3 }
      const actualizado = await api(`/api/admin/clientes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ [campo]: valor })
      });
      setClientes((prev) => prev.map((c) => (c._id === id ? actualizado : c)));
      avisar('Cambios guardados ✓', 'ok');
    } catch (err) {
      avisar(err.message, 'error');   // si falló, el select vuelve solo a su valor real
    }
  }

  async function eliminar(cliente) {
    if (!confirm(`¿Eliminar a ${cliente.nombre}? Se borra su cuenta y no se puede deshacer.`)) return;
    try {
      await api(`/api/admin/clientes/${cliente._id}`, { method: 'DELETE' });
      setClientes((prev) => prev.filter((c) => c._id !== cliente._id));
      avisar('Cliente eliminado', 'ok');
    } catch (err) {
      avisar(err.message, 'error');
    }
  }

  // ===== Valores calculados (no son estado: salen de clientes + filtros) =====
  const contar = (estado) => clientes.filter((c) => c.estado === estado).length;
  const tarjetas = [
    ['Total', clientes.length],
    ['Pendientes', contar('pendiente')],
    ['En proceso', contar('en-proceso')],
    ['Activos', contar('activo')],
    ['Finalizados', contar('finalizado')]
  ];

  const texto = busqueda.trim().toLowerCase();
  const filtrados = clientes.filter((c) =>
    (filtroEstado === 'todos' || c.estado === filtroEstado) &&
    (c.nombre.toLowerCase().includes(texto) || c.email.toLowerCase().includes(texto))
  );

  const barra = (
    <nav className="acciones-barra">
      <Link className="enlace-barra" to="/panel">Mi panel</Link>
      <button className="btn-salir" onClick={() => cerrarSesion()}>Cerrar sesión</button>
    </nav>
  );

  return (
    <PaginaInterna barra={barra}>
      <div className="contenedor-admin">
        <h1>Administración de clientes</h1>

        {!cargando && !error && (
          <section className="grid-resumen">
            {tarjetas.map(([titulo, numero]) => (
              <article key={titulo} className="tarjeta-panel">
                <h3>{titulo}</h3>
                <p className="numero-grande">{numero}</p>
              </article>
            ))}
          </section>
        )}

        <div className="barra-filtros">
          <input type="search" placeholder="Buscar por nombre o correo..."
                 value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
            <option value="todos">Todos los estados</option>
            {opcionesDe(NOMBRES_ESTADO)}
          </select>
        </div>

        <div className="tabla-contenedor">
          <table className="tabla-clientes">
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Servicio</th>
                <th>Estado</th>
                <th>Etapa</th>
                <th>Registro</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cargando ? (
                <tr><td colSpan={6} className="tabla-vacia">Cargando clientes...</td></tr>
              ) : error ? (
                <tr><td colSpan={6} className="tabla-vacia">{error}</td></tr>
              ) : filtrados.length === 0 ? (
                <tr><td colSpan={6} className="tabla-vacia">No hay clientes que coincidan.</td></tr>
              ) : (
                filtrados.map((c) => {
                  const esYo = c._id === miId;
                  return (
                    <tr key={c._id}>
                      <td>
                        <strong>{c.nombre}</strong>
                        {esYo && <> <span className="etiqueta-tu">tú</span></>}
                        <br />
                        <small>{c.email}</small>
                      </td>
                      <td>{NOMBRES_SERVICIO[c.servicio]}</td>
                      <td>
                        <select value={c.estado}
                                onChange={(e) => actualizar(c._id, 'estado', e.target.value)}>
                          {opcionesDe(NOMBRES_ESTADO)}
                        </select>
                      </td>
                      <td>
                        <select value={c.etapa}
                                onChange={(e) => actualizar(c._id, 'etapa', Number(e.target.value))}>
                          {opcionesDe(NOMBRES_ETAPA)}
                        </select>
                      </td>
                      <td>{formatearFecha(c.createdAt)}</td>
                      <td>
                        {!esYo && (
                          <button className="btn-tabla-peligro" onClick={() => eliminar(c)}>Eliminar</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {aviso && <p className={`mensaje toast ${aviso.tipo}`}>{aviso.texto}</p>}
    </PaginaInterna>
  );
}