const router = require('express').Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const soloAdmin = require('../middleware/soloAdmin');
const { Cliente, ESTADOS } = require('../../modelos/clientes');

// Toda ruta de este archivo pasa primero por auth y luego por soloAdmin
router.use(auth, soloAdmin);

// GET /api/admin/clientes → lista de TODOS los clientes
router.get('/clientes', async (req, res) => {
  const clientes = await Cliente.find().sort({ createdAt: -1 }); // los más nuevos primero
  res.json(clientes);
});

// PUT /api/admin/clientes/:id → cambiar estado y/o etapa
router.put('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }

  const { estado, etapa } = req.body;
  const cambios = {};

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido' });
    }
    cambios.estado = estado;
  }

  if (etapa !== undefined) {
    if (!Number.isInteger(etapa) || etapa < 1 || etapa > 5) {
      return res.status(400).json({ error: 'La etapa debe ser un número entre 1 y 5' });
    }
    cambios.etapa = etapa;
  }

  if (Object.keys(cambios).length === 0) {
    return res.status(400).json({ error: 'No hay nada que actualizar' });
  }

  const cliente = await Cliente.findByIdAndUpdate(id, cambios, { new: true });
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json(cliente);
});

// DELETE /api/admin/clientes/:id → eliminar un cliente
router.delete('/clientes/:id', async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({ error: 'ID no válido' });
  }
  if (id === req.clienteId) {
    return res.status(400).json({ error: 'No puedes eliminar tu propia cuenta desde aquí' });
  }

  const cliente = await Cliente.findByIdAndDelete(id);
  if (!cliente) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.status(204).end();
});

module.exports = router;