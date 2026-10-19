const { Cliente } = require('../../modelos/clientes');

// Se usa DESPUÉS de auth. auth dice "sé quién eres"; este dice "y tienes permiso".
module.exports = async function soloAdmin(req, res, next) {
  // Consultamos el rol en la BD en cada petición (no lo guardamos en el token),
  // así si le quitas el rol a alguien, el cambio aplica al instante.
  const cliente = await Cliente.findById(req.clienteId).select('rol');

  if (!cliente || cliente.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido' });
  }
  next();
};