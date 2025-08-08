const express = require('express');
const router = express.Router();
const sql = require('../db/neonClient');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const e = require('express');

// Validación
const validarCredenciales = [
  body('nombre').notEmpty().withMessage('Nombre obligatorio'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Mínimo 6 caracteres'),
];

// Registro
router.post('/register', validarCredenciales, async (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });

  const { nombre, email, password } = req.body;
  const passwordHash = bcrypt.hashSync(password, 10);
  //console.log('Petición recibida la info es:', req.body);
      
    //console.log('Datos a insertar:', { nombre, email, passwordHash });

  try {
    const result = await sql`
      INSERT INTO "users" ("user", "email", "password")
      VALUES (${nombre}, ${email}, ${passwordHash}) 
      RETURNING id, user, email`;
      //console.log('Usuario registrado:', result);

    const token = jwt.sign({ id: result[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ usuario: result[0], token });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar usuario: ' + error.message + ' - ' + error.detail + ' - ' + error });
  }
});

// Login
router.post('/login', async (req, res) => {
//console.log('Petición recibida de login:');

    const errores = validationResult(req);
    if (!req.body || !req.body.email || !req.body.password) {
        return res.status(400).json({ mensaje: 'Email y contraseña son requeridos' });
   // if (!errores.isEmpty()) return res.status(400).json({ errores: errores.array() });
    
  }
  const { email, password } = req.body;
    //console.log('Datos de login:', { email, password });

  try {
    const result = await sql`SELECT * FROM users WHERE email = ${email}`;
    const usuario = result[0];
    //console.log('Usuario encontrado:', usuario);

    if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
      return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
    }

    const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ usuario: { id: usuario.id, nombre: usuario.user, email: usuario.email }, token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ error: 'Error al iniciar sesión: ' + error.message + ' - ' + error.detail + ' - ' + error });
  }

  /*   // Verifica si el usuario existe y la contraseña es correcta
  const result = await sql`SELECT * FROM users WHERE email = ${email}`;
  const usuario = result[0];
  console.log('Usuario encontrado:', result);
 

  if (!usuario || !bcrypt.compareSync(password, usuario.password)) {
    return res.status(401).json({ error: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }, token }); */
});

module.exports = router;
