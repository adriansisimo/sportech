// Si hay token guardado, el botón cambia de "Ingresar" a "Mi panel"
const btnAcceso = document.getElementById('btn-asesoria');

if (btnAcceso && localStorage.getItem('token')) {
  btnAcceso.textContent = 'Mi panel';
  btnAcceso.href = 'panel.html';
}