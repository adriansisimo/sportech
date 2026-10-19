const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Cliente, SERVICIOS } = require('../../modelos/clientes');

const crearToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// POST /api/auth/registro
router.post('/registro', async (req, res) => {
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

  const hash = await bcrypt.hash(password, 10); // 10 = qué tan "costosa" es la encriptación
  const cliente = await Cliente.create({ nombre, email: correo, password: hash, servicio });

  res.status(201).json({ token: crearToken(cliente._id) });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Faltan datos' });
  }

  // +password => aquí SÍ necesitamos la contraseña para compararla
  const cliente = await Cliente.findOne({ email: email.toLowerCase().trim() }).select('+password');
  const ok = cliente && (await bcrypt.compare(password, cliente.password));

  if (!ok) {
    // Mismo mensaje para "correo no existe" y "clave mala": no le damos pistas a un atacante
    return res.status(401).json({ error: 'Correo o contraseña incorrectos' });
  }

  res.json({ token: crearToken(cliente._id) });
});

module.exports = router;