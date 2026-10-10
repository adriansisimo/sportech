const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Conectar fronten con el backend
app.use(express.static('public'));

// Conectar a la base de datos
const MONGODB_URI = process.env.MONGODB_URI;
const conectarDB = async () => {
    if (!MONGODB_URI) {
        console.error('Falta la variable MONGODB_URI en el archivo .env');
        process.exit(1);
    }

    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Conectado a la base de datos');
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error.message);
        process.exit(1);
    }
};

conectarDB();

const Cliente = require("../modelos/clientes");

// Rutas
// GET
app.get('/user/cliente', async (req, res) => {
    try {
            const clientes = await Cliente.find();
    res.status(200).json(clientes);
    } catch (error) {
        console.error('Error al obtener clientes:', error.message);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// GET por ID
app.get('/user/cliente/:id', async (req, res) => {
    const { id } = req.params;
    const clientes = await Cliente.findById(id);
    if (!clientes) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(clientes);
});

// POST 
app.post('/user/cliente', async (req, res) => {
    const nombre = req.body.nombre;
    const correo = req.body.correo;
    const telefono = req.body.telefono;
    const mensaje = req.body.mensaje;
    const cliente = {
        nombre: nombre,
        correo: correo,
        telefono: telefono,
        mensaje: mensaje
    }

    const nuevoCliente = new Cliente(cliente);
    const clienteGuardado = await nuevoCliente.save();

    res.status(201).json(clienteGuardado);
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});