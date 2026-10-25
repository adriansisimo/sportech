import { useState } from 'react';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

const FORMSPREE = 'https://formspree.io/f/xkjwgqlb';

export default function Contacto() {
  const [telefono, setTelefono] = useState('');
  const [resultado, setResultado] = useState(null);   // { texto, tipo } o null
  const [enviando, setEnviando] = useState(false);

  async function enviar(e) {
    e.preventDefault();
    const form = e.currentTarget;                     // guardarlo ANTES del await
    setEnviando(true);
    try {
      const res = await fetch(FORMSPREE, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        setResultado({ texto: '¡Gracias! Tu mensaje fue enviado correctamente.', tipo: 'ok' });
        form.reset();
        setTelefono('');
      } else {
        setResultado({ texto: 'Hubo un error, intenta de nuevo.', tipo: 'error' });
      }
    } catch {
      setResultado({ texto: 'Hubo un error de conexión.', tipo: 'error' });
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section id="contacto">
      <div className="contacto-header">
        <span className="etiqueta-contacto">Contacto</span>
        <h2>¿Listo para llevar tu proyecto al siguiente nivel?</h2>
        <span className="subtitulo-contacto">
          Cuéntanos tu idea y hagamos que más personas se conecten con el deporte.
        </span>
      </div>

      <div className="contenido-contacto">
        <div className="metodos-contacto">
          <article>
            <Mail />
            <div className="info-metodo">
              <span>Correo</span>
              <small>adrian033109.aa@gmail.com</small>
            </div>
          </article>

          <article>
            <Phone />
            <div className="info-metodo">
              <span>Teléfono</span>
              <small>+57 3235176563</small>
            </div>
          </article>

          <article>
            <MapPin />
            <div className="info-metodo">
              <a href="https://maps.app.goo.gl/t15gsEpeWvfNJNeu8" target="_blank"
                 rel="noopener noreferrer">Ubicación</a>
              <small>Cali, Colombia</small>
            </div>
          </article>

          <article>
            <Clock />
            <div className="info-metodo">
              <span>Horario</span>
              <small>Lunes a Viernes</small>
              <small>8:00 a.m - 8:00 p.m</small>
            </div>
          </article>
        </div>

        <form id="contactForm" onSubmit={enviar}>
          <div className="fila-form">
            <div className="campo-form">
              <label htmlFor="name" className="sr-only">Nombre completo</label>
              <input type="text" id="name" name="name" placeholder="Nombre completo" required />
            </div>
            <div className="campo-form">
              <label htmlFor="email" className="sr-only">Correo electrónico</label>
              <input type="email" id="email" name="email" placeholder="Correo electrónico" required />
            </div>
          </div>

          <div className="campo-form">
            <label htmlFor="phone" className="sr-only">Teléfono</label>
            <input type="tel" id="phone" name="phone" placeholder="Teléfono (opcional)"
                   inputMode="numeric" pattern="[0-9]{10}" maxLength={10}
                   title="Ingresa un número de 10 dígitos"
                   value={telefono}
                   onChange={(e) => setTelefono(e.target.value.replace(/[^0-9]/g, ''))} />
          </div>

          <div className="campo-form">
            <label htmlFor="message" className="sr-only">Mensaje</label>
            <textarea id="message" name="message" rows={4}
                      placeholder="Cuéntanos sobre tu proyecto..." required />
          </div>

          <button type="submit" className="btn-enviar" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar mensaje'}
          </button>
          {resultado && <p className={`mensaje ${resultado.tipo}`}>{resultado.texto}</p>}
        </form>

        <div className="mapa-contacto">
          <iframe
            title="Ubicación de SporTech en Cali"
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d248.91882621908283!2d-76.4787836!3d3.422766!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e30a7401af13dd5%3A0x5a9987bc7ee13360!2sDg.%2026p%209%20%239604%2C%20Marroquin%20II%2C%20Cali%2C%20Valle%20del%20Cauca!5e0!3m2!1sen!2sco!4v1786085091584!5m2!1sen!2sco"
            width="100%" height="100%" style={{ border: 0 }} allowFullScreen
            loading="lazy" referrerPolicy="strict-origin-when-cross-origin"></iframe>
        </div>
      </div>
    </section>
  );
}