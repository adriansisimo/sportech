import { useEffect, useRef, useState } from 'react';

export default function SelectCustom({ opciones, valor, onChange }) {
  const [abierto, setAbierto] = useState(false);
  const [resaltada, setResaltada] = useState(-1);
  const contenedor = useRef(null);
  const claves = Object.keys(opciones);

  // Cerrar al hacer clic fuera del desplegable
  useEffect(() => {
    function alClickFuera(e) {
      if (contenedor.current && !contenedor.current.contains(e.target)) setAbierto(false);
    }
    document.addEventListener('mousedown', alClickFuera);
    return () => document.removeEventListener('mousedown', alClickFuera);
  }, []);

  function elegir(clave) {
    onChange(clave);
    setAbierto(false);
  }

  function alTeclear(e) {
    if (e.key === 'Escape') {
      setAbierto(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!abierto) {
        setAbierto(true);
        setResaltada(claves.indexOf(valor));
        return;
      }
      const paso = e.key === 'ArrowDown' ? 1 : -1;
      setResaltada((i) => (i + paso + claves.length) % claves.length);
      return;
    }
    if (e.key === 'Enter' && abierto && resaltada >= 0) {
      e.preventDefault();
      elegir(claves[resaltada]);
    }
  }

  return (
    <div className={`select-custom ${abierto ? 'abierto' : ''}`} ref={contenedor} onKeyDown={alTeclear}>
      <button type="button" className="select-boton" aria-haspopup="listbox" aria-expanded={abierto}
              onClick={() => { setAbierto((a) => !a); setResaltada(claves.indexOf(valor)); }}>
        <span className="select-valor">{opciones[valor]}</span>
        <svg className="select-flecha" xmlns="http://www.w3.org/2000/svg" width="18" height="18"
             viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
             strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      <ul className="select-lista" role="listbox">
        {claves.map((clave, i) => (
          <li key={clave} role="option" aria-selected={clave === valor}
              className={`select-opcion ${i === resaltada ? 'resaltada' : ''}`}
              onClick={() => elegir(clave)}>
            {opciones[clave]}
          </li>
        ))}
      </ul>
    </div>
  );
}