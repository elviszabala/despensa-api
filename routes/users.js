const express = require('express');
const router = express.Router();
const sql = require('../db/neonClient');
const { body, validationResult } = require('express-validator');
const verificarToken = require('../middleware/verificarToken');

const validarUsuario = [
  body('nombre').notEmpty().withMessage('Nombre obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
];

// Consultar todos los usuarios
router.get('/', verificarToken, async (req, res) => {
  const result = await sql`SELECT id, nombre, email FROM users`;
  res.json(result);
});

// Consultar por ID
router.get('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const result = await sql`SELECT id, nombre, email FROM users WHERE id = ${id}`;
  if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(result[0]);
});

// Agregar usuario
router.post('/', validarUsuario, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { nombre, email } = req.body;
  const result = await sql`
    INSERT INTO users (nombre, email, password)
    VALUES (${nombre}, ${email}, 'default')
    RETURNING id, nombre, email`;
  res.status(201).json(result[0]);
});

// Editar usuario
router.put('/:id', verificarToken, validarUsuario, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { id } = req.params;
  const { nombre, email } = req.body;
  const result = await sql`
    UPDATE users SET nombre = ${nombre}, email = ${email}
    WHERE id = ${id}
    RETURNING id, nombre, email`;
  if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json(result[0]);
});

// Eliminar usuario
router.delete('/:id', verificarToken, async (req, res) => {
  const { id } = req.params;
  const result = await sql`DELETE FROM users WHERE id = ${id} RETURNING id, nombre, email`;
  if (result.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });
  res.json({ mensaje: 'Usuario eliminado', usuario: result[0] });
});

module.exports = router;
