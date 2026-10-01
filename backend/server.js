const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Conectar fronten con el backend
app.use(express.static('public'));


const data = {
    id: 1,
    nombre: 'Adrian'
}

// Rutas
// GET
app.get('api/data', (req, res) => {
    res.json(data);
});

// GET por ID
app.get('api/data/:id', (req, res) => {
    const { id } = req.params;
    res.json(data);
});


app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
})