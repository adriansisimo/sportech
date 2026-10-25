import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { peticion } from '../../api';

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const [autenticado, setAutenticado] = useState(false);

  useEffect(() => {
    peticion('/api/auth/sesion')
      .then((r) => setAutenticado(r.autenticado))
      .catch(() => {});
  }, []);

  const cerrar = () => setAbierto(false);
  const activo = abierto ? 'active' : '';

  return (
    <header>
      <h2>Spor<span className="titulo-tech">Tech</span></h2>
      <nav className="navegacion">
        <div className={`hamburguesa ${activo}`} role="button" aria-label="Abrir menú"
             aria-expanded={abierto} onClick={() => setAbierto((a) => !a)}>
          <span className="hamburguesa-bar"></span>
          <span className="hamburguesa-bar"></span>
          <span className="hamburguesa-bar"></span>
        </div>
        <ul className={`nav-menu ${activo}`}>
          <li><a className="nav-links" href="#inicio" onClick={cerrar}>Inicio</a></li>
          <li><a className="nav-links" href="#servicios" onClick={cerrar}>Servicios</a></li>
          <li><a className="nav-links" href="#nosotros" onClick={cerrar}>Nosotros</a></li>
          <li><a className="nav-links" href="#contacto" onClick={cerrar}>Contacto</a></li>
          <li>
            <Link className="nav-links" id="btn-asesoria" to={autenticado ? '/panel' : '/acceso'}>
              {autenticado ? 'Mi panel' : 'Ingresar'}
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}