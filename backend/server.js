require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());                                              // leer JSON del body
app.use(express.static(path.join(__dirname, '..', 'public')));        // servir el frontend

app.use('/api/auth', require('./routes/auth'));
app.use('/api/clientes', require('./routes/clientes'));

// Manejador global de errores: si algo explota, responde JSON en vez de colgarse
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

// Primero conectamos a Mongo, y SOLO si conecta, levantamos el servidor
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
  })
  .catch((err) => console.error('Error conectando a MongoDB:', err));