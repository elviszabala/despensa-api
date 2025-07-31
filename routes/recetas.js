const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const { getRecetas, crearReceta } = require('../controllers/recetasController');

// Obtener recetas (ruta protegida)
router.get('/', verificarToken, getRecetas);

// Crear receta (validación + protección)
router.post('/',
  verificarToken,
  body('nombre').notEmpty(),
  body('ingredientes').isArray(),
  crearReceta
);

module.exports = router;
