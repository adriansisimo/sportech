const mongoose = require('mongoose');

// Lista oficial de servicios. Coincide con las 4 tarjetas de tu página.
const SERVICIOS = [
  'creacion-web',
  'administracion-web',
  'mejora-web',
  'estrategia-conexion'
];

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    servicio: { type: String, enum: SERVICIOS, required: true },
    estado: {
      type: String,
      enum: ['pendiente', 'en-proceso', 'activo', 'finalizado'],
      default: 'pendiente'
    }
  },
  { timestamps: true }
);

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = { Cliente, SERVICIOS };