// Archivo utilizado para almacenar todas las rutas principales
// de la aplicacion

const express = require('express');
const router = express.Router();

// Definimos la ruta inicial
router.get('/' , (req, res) => {
    res.render('index', {title: "Solicitud Lab - Página Principal", header: "Juntos contra el COVID-19"});
});

module.exports = router;