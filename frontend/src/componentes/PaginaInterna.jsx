import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function PaginaInterna({ barra, children }) {
  useEffect(() => {
    document.body.classList.add('pagina-interna');
    return () => document.body.classList.remove('pagina-interna');
  }, []);

  return (
    <>
      <header className="barra-interna">
        <Link className="logo-link" to="/">
          Spor<span className="titulo-tech">Tech</span>
        </Link>
        {barra}
      </header>
      <main>{children}</main>
    </>
  );
}