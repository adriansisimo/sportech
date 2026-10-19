const jwt = require('jsonwebtoken');

// Un middleware es un "portero": revisa la petición antes de que llegue a la ruta.
module.exports = function auth(req, res, next) {
  const header = req.headers.authorization || '';           // "Bearer eyJhbGci..."
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET); // lanza error si es falso o expiró
    req.clienteId = payload.id;  // dejamos el id disponible para la ruta que sigue
    next();                      // "puede pasar"
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};