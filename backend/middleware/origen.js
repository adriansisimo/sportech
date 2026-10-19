// Si una petición que MODIFICA datos trae el encabezado Origin,
// tiene que venir de nuestro propio sitio. Es una segunda barrera además de sameSite.
module.exports = function verificarOrigen(req, res, next) {
  const metodosSeguros = ['GET', 'HEAD', 'OPTIONS'];
  if (metodosSeguros.includes(req.method)) return next();

  const origen = req.headers.origin;
  if (origen) {
    let host;
    try {
      host = new URL(origen).host;
    } catch {
      return res.status(403).json({ error: 'Origen no permitido' });
    }
    if (host !== req.headers.host) {
      return res.status(403).json({ error: 'Origen no permitido' });
    }
  }
  next();
};