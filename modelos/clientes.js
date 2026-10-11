const mongoose = require("mongoose");
const clienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    trim: true,
    required: true
  },
  correo: {
    type: String,
    trim: true,
    lowercase: true,
    required: true
  },
  telefono: {
    type: String,
    trim: true
  },
  mensaje: {
    type: String,
    trim: true
  },
});

module.exports = mongoose.model("Clientes", clienteSchema);
