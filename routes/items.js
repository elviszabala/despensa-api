const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const verificarToken = require('../middlewares/verificarToken');
const { getItems, createItem } = require('../controllers/itemsController');

// Middleware de validación
const validateItem = [
  body('nombre').notEmpty().withMessage('Nombre del item es obligatorio'),
  body('cantidad').isInt({ gt: 0 }).withMessage('Cantidad debe ser un número entero mayor que 0'),
];  

// Rutas para items
//router.get('/', verificarToken, getItems);
router.get('/',  getItems);
router.post('/', verificarToken, validateItem, createItem);

// Exportar el router para usarlo en index.js
module.exports = router;

