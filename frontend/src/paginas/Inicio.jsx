import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { SplitText } from 'gsap/SplitText';
import Navbar from '../componentes/inicio/Navbar';
import Hero from '../componentes/inicio/Hero';
import Servicios from '../componentes/inicio/Servicios';
import Proceso from '../componentes/inicio/Proceso';
import Nosotros from '../componentes/inicio/Nosotros';
import Proyectos from '../componentes/inicio/Proyectos';
import Contacto from '../componentes/inicio/Contacto';
import Footer from '../componentes/inicio/Footer';

gsap.registerPlugin(SplitText);

let preloaderMostrado = false;   // se recuerda mientras no recargues la página

export default function Inicio() {
  const raiz = useRef(null);
  const [conPreloader] = useState(!preloaderMostrado);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Si ya lo vio, mostramos todo de una vez
      if (!conPreloader) {
        gsap.set('main', { opacity: 1 });
        gsap.set(document.body, { overflow: 'auto' });
        return;
      }

      const split = SplitText.create('.Logo', { type: 'chars' });

      gsap.timeline({ onComplete: () => { preloaderMostrado = true; } })
        .set('.preLoader', { autoAlpha: 1 }, 0)
        .from('.Logo', { scale: 0.7, duration: 2.5, ease: 'none' }, 0)
        .from(split.chars, { opacity: 0, duration: 0.8, stagger: 0.15, ease: 'none' }, 0)
        .from(split.chars, { rotationY: 360, duration: 0.6, stagger: 0.15, ease: 'none' }, 0.2)
        .to('.preLoader', { autoAlpha: 0, duration: 1.5, ease: 'power1.out' }, 3.5)
        .to('main', { opacity: 1, duration: 0.6 }, 4.5)
        .set(document.body, { overflow: 'auto' }, 5);
    }, raiz);

    return () => ctx.revert();
  }, [conPreloader]);

  return (
    <div ref={raiz}>
      {conPreloader && (
        <div className="preLoader">
          <div className="Logo">
            <h1>Spor<span className="titulo-tech">Tech</span></h1>
          </div>
        </div>
      )}

      <Navbar />
      <main><Hero /></main>
      <Servicios />
      <Proceso />
      <Nosotros />
      <Proyectos />
      <Contacto />
      <Footer />
    </div>
  );
}