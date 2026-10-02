const btn = document.querySelector('.hamburguesa');
const navMenu = document.querySelector('.nav-menu');

btn.addEventListener('click', () => {
  btn.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Cerrar el menú móvil al tocar cualquier link de navegación
document.querySelectorAll('.nav-links').forEach((link) => {
  link.addEventListener('click', () => {
    btn.classList.remove('active');
    navMenu.classList.remove('active');
  });
});