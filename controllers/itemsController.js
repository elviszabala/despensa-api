
const sql = require('../db/neonClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');




// Validación
const validateItem = [
  body('nombre').notEmpty().withMessage('Nombre del item es obligatorio'),
  body('cantidad').isInt({ gt: 0 }).withMessage('Cantidad debe ser un número entero mayor que 0'),
];

const validateUser = [
  body('user').notEmpty().withMessage('El campo user es obligatorio'),
];
// Obtener todos los items
const getItems =( validateUser, async (req, res) => {
    const errores = validationResult(req);
    //console.log('validateUser: ', validateUser);
    const { user } = req.body;
    console.log('user: ', user);
    //console.log('Petición recibida de getItems:', req.body);
    if (!errores.isEmpty()) return res.status(400).json({ erroresesess: errores.array() });
    //console.log('Obteniendo items desde la base de datos y el usuario es: ', req.body.user);

 if (!req.body || !req.body.user) {
    return res.status(400).json({ mensaje: 'El campo user es obligatorio' });
  }
  try {
    const result = await sql`SELECT * FROM items where user = ${user}`;
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los items: ' + error.message });
  }
});

// Crear un nuevo item
const createItem = ( validateItem, async (req, res) => {
    console.log('Creando un nuevo item');
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { nombre, cantidad } = req.body;
  try {
    const result = await sql`
      INSERT INTO items (nombre, cantidad)
      VALUES (${nombre}, ${cantidad})
      RETURNING id, nombre, cantidad`;
    res.status(201).json({ item: result[0] });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el item: ' + error.message });
  }
});

module.exports = {
  getItems,
  createItem};
