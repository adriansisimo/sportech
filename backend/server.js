require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const path = require('path');

const verificarOrigen = require('./middleware/origen');

const app = express();
const PORT = process.env.PORT || 3000;
const DIST = path.join(__dirname, '..', 'frontend', 'dist');

// Detrás de un proxy (Render, Railway...) esto hace que el limitador vea la IP real del usuario
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);

app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// ===== API =====
app.use('/api', verificarOrigen);
app.use('/api/admin', require('./routes/admin'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/clientes', require('./routes/clientes'));

// Cualquier /api/... que no exista responde JSON (nunca la página de React)
app.use('/api', (req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));

// ===== FRONTEND (React compilado) =====
app.use(express.static(DIST));

// Rutas de React (/panel, /admin, /acceso...): si el usuario recarga o entra directo,
// el servidor devuelve index.html y React Router decide qué pantalla mostrar.
// El (?!api...) evita que esto se trague las rutas de la API.
app.get(/^\/(?!api(\/|$)).*/, (req, res) => {
  res.sendFile(path.join(DIST, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('Error conectando a MongoDB:', err);
    process.exit(1);
  });