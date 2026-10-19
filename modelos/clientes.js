const mongoose = require('mongoose');

const SERVICIOS = [
  'creacion-web',
  'administracion-web',
  'mejora-web',
  'estrategia-conexion'
];

const ESTADOS = ['pendiente', 'en-proceso', 'activo', 'finalizado'];

const clienteSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    servicio: { type: String, enum: SERVICIOS, required: true },
    estado: { type: String, enum: ESTADOS, default: 'pendiente' },
    // NUEVO: etapa del proceso (1 a 5, igual que los pasos de "Así trabajamos contigo")
    etapa: { type: Number, min: 1, max: 5, default: 1 },
    // NUEVO: quién es admin. Nadie puede ponerse este valor desde la web.
    rol: { type: String, enum: ['cliente', 'admin'], default: 'cliente' }
  },
  { timestamps: true }
);

const Cliente = mongoose.model('Cliente', clienteSchema);

module.exports = { Cliente, SERVICIOS, ESTADOS };