const jwt = require('jsonwebtoken');

module.exports = function auth(req, res, next) {
  const token = req.cookies.token; // cookie-parser la deja aquí

  if (!token) {
    return res.status(401).json({ error: 'No autenticado' });
  }

  try {
    // algorithms: fija el algoritmo permitido, así nadie puede colar un token firmado de otra forma
    const payload = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    req.clienteId = payload.id;
    next();
  } catch {
    res.status(401).json({ error: 'Sesión inválida o expirada' });
  }
};