const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Conectar fronten con el backend
app.use(express.static('public'));

let data = [
    {
        id: 1,
        nombre: 'Adrian'
    }
];

// Rutas
// GET
app.get('/api/data', (req, res) => {
    res.json(data);
});

// GET por ID
app.get('/api/data/:id', (req, res) => {
    const { id } = req.params;
    const cliente = data.find(c => c.id === parseInt(id));
    if (!cliente) {
        return res.status(404).json({ error: 'Cliente no encontrado' });
    }
    res.status(200).json(cliente);
});

// POST 
app.post('/api/data', (req, res) => {
    const { nombre } = req.body;
    const cliente = {
        nombre: nombre,
    };
    const clienteNuevo = {
        id: data.length + 1,
        nombre: nombre.trim()
    };

    data.push(clienteNuevo);
    res.status(201).json(clienteNuevo);
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});