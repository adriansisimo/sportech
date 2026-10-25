export const formatearFecha = (fecha, mes = 'short') =>
  new Date(fecha).toLocaleDateString('es-CO', { day: 'numeric', month: mes, year: 'numeric' });