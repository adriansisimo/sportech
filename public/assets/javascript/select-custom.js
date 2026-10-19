// Convierte el HTML de un ".select-custom" en un desplegable funcional.
// raiz       -> el contenedor .select-custom
// alCambiar  -> función que se ejecuta con el valor nuevo cada vez que el usuario elige
function activarSelect(raiz, alCambiar = () => {}) {
  const boton = raiz.querySelector('.select-boton');
  const texto = raiz.querySelector('.select-valor');
  const oculto = raiz.querySelector('input[type="hidden"]'); // aquí vive el valor real (para el FormData)
  const opciones = [...raiz.querySelectorAll('.select-opcion')];

  // Índice de la opción "resaltada" (la que se mueve con las flechas)
  let activa = Math.max(0, opciones.findIndex((o) => o.dataset.valor === oculto.value));

  function resaltar(i) {
    activa = (i + opciones.length) % opciones.length; // el % hace que dé la vuelta al llegar al final
    opciones.forEach((o, n) => o.classList.toggle('resaltada', n === activa));
    opciones[activa].scrollIntoView({ block: 'nearest' });
  }

  function abrir() {
    raiz.classList.add('abierto');
    boton.setAttribute('aria-expanded', 'true');
    resaltar(activa);
  }

  function cerrar() {
    raiz.classList.remove('abierto');
    boton.setAttribute('aria-expanded', 'false');
  }

  function elegir(i) {
    const opcion = opciones[i];
    oculto.value = opcion.dataset.valor;
    texto.textContent = opcion.textContent.trim();
    opciones.forEach((o) => o.setAttribute('aria-selected', String(o === opcion)));
    cerrar();
    boton.focus();
    alCambiar(oculto.value);
  }

  // Clic en el botón: abre o cierra
  boton.addEventListener('click', () => {
    raiz.classList.contains('abierto') ? cerrar() : abrir();
  });

  // Clic en una opción
  opciones.forEach((opcion, i) => opcion.addEventListener('click', () => elegir(i)));

  // Teclado: flechas, Enter y Escape
  raiz.addEventListener('keydown', (e) => {
    const abierto = raiz.classList.contains('abierto');

    if (e.key === 'Escape' && abierto) {
      cerrar();
      boton.focus();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      abierto ? resaltar(activa + 1) : abrir();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      abierto ? resaltar(activa - 1) : abrir();
    } else if (e.key === 'Enter' && abierto) {
      e.preventDefault();
      elegir(activa);
    }
  });

  // Clic fuera: cierra. Como el panel se repinta, el desplegable viejo desaparece del DOM;
  // si eso pasó, este listener se elimina solo para no acumular basura.
  const clicFuera = (e) => {
    if (!raiz.isConnected) return document.removeEventListener('click', clicFuera);
    if (!raiz.contains(e.target)) cerrar();
  };
  document.addEventListener('click', clicFuera);
}