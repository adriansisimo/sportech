const router = require('express').Router();
const auth = require('../middleware/auth');
const { Cliente, SERVICIOS } = require('../../modelos/clientes');
const { cerrarSesion } = require('../utils/sesion');

router.use(auth); // TODAS las rutas de este archivo exigen token

// GET /api/clientes/me → datos del cliente logueado
router.get('/me', async (req, res) => {
  const cliente = await Cliente.findById(req.clienteId);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

// PUT /api/clientes/me → actualizar nombre y/o servicio
router.put('/me', async (req, res) => {
  const { nombre, servicio } = req.body;
  const cambios = {};

  if (nombre) cambios.nombre = nombre.trim();
  if (servicio) {
        const actual = await Cliente.findById(req.clienteId).select('estado');
    if (actual.estado !== 'pendiente') {
      return res.status(409).json({
        error: 'Tu servicio ya está en marcha. Escríbenos por WhatsApp para cambiarlo.'
      });
    }
    if (!SERVICIOS.includes(servicio)) {
      return res.status(400).json({ error: 'Servicio no válido' });
    }
    cambios.servicio = servicio;
  }

  // new:true => devuelve el documento YA actualizado
  const cliente = await Cliente.findByIdAndUpdate(req.clienteId, cambios, { new: true });
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

// DELETE /api/clientes/me → eliminar la cuenta
router.delete('/me', async (req, res) => {
  await Cliente.findByIdAndDelete(req.clienteId);
  cerrarSesion(res);
  res.status(204).end();
});

module.exports = router;