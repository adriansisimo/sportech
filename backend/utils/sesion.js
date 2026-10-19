const jwt = require('jsonwebtoken');

const SIETE_DIAS_MS = 7 * 24 * 60 * 60 * 1000;

// Se definen UNA vez y se usan para crear y para borrar la cookie
// (para borrarla, el navegador exige las mismas opciones con que se creó).
const opciones = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/'
};

function iniciarSesion(res, clienteId) {
  const token = jwt.sign({ id: clienteId }, process.env.JWT_SECRET, { expiresIn: '7d' });
  res.cookie('token', token, { ...opciones, maxAge: SIETE_DIAS_MS });
}

function cerrarSesion(res) {
  res.clearCookie('token', opciones);
}

module.exports = { iniciarSesion, cerrarSesion };