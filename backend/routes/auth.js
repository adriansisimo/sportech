const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { Cliente, SERVICIOS } = require('../../modelos/clientes');
const { iniciarSesion, cerrarSesion } = require('../utils/sesion');

// Máximo 10 intentos de login/registro por IP cada 15 minutos
const limitarIntentos = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Demasiados intentos. Intenta de nuevo en 15 minutos.' }
});

// POST /api/auth/registro
router.post('/registro', limitarIntentos, async (req, res) => {
  const { nombre, email, password, servicio } = req.body;

  if (!nombre || !email || !password || !servicio) {
    return res.status(400).json({ error: 'Faltan datos' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'La contraseña debe tener mínimo 6 caracteres' });
  }
  if (!SERVICIOS.includes(servicio)) {
    return res.status(400).json({ error: 'Servicio no válido' });
  }

  const correo = email.toLowerCase().trim();
  const existe = await Cliente.findOne({ email: correo });
  if (existe) {
    return res.status(409).json({ error: 'Ya existe una cuenta con ese correo' });
  }

  const hash = await bcrypt.hash(password, 10);
  const cliente = await Cliente.create({ nombre, email: correo, password: hash, servicio });

  iniciarSesion(res, cliente._id);       // ← pone la cookie
  res.status(201).json({ ok: true });
});

// POST /api/auth/login
router.post('/login', limitarIntentos, async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  const cliente = await Cliente.findOne({ email: email.toLowerCase().trim() }).select('+password');
  const ok = cliente && (await bcrypt.compare(password, cliente.password));

  if (!ok) {
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  iniciarSesion(res, cliente._id);
  res.json({ ok: true });
});

// POST /api/auth/logout → borra la cookie
router.post('/logout', (req, res) => {
  cerrarSesion(res);
  res.json({ ok: true });
});

// GET /api/auth/sesion → "¿hay sesión?" Siempre responde 200 (así no llena la consola de errores rojos)
router.get('/sesion', (req, res) => {
  try {
    jwt.verify(req.cookies.token, process.env.JWT_SECRET, { algorithms: ['HS256'] });
    res.json({ autenticado: true });
  } catch {
    res.json({ autenticado: false });
  }
});

module.exports = router;