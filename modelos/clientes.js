const mongoose = require("mongoose");
const clienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  correo: {
    type: String,
    required: true,
  },
  telefono: {
    type: String,
  },
  mensaje: {
    type: String,
  },
});

module.exports = mongoose.model("Clientes", clienteSchema);
