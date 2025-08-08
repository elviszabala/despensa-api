const express = require('express');
const router = express.Router();
const sql = require('../db/neonClient');

router.get('/', async (req, res) => {
  console.log('Petición recibida en la ruta /test');
  try {
    console.log('Conectando a la base de datos...');
    const result = await sql`SELECT * FROM users`;

    // Si quieres mostrar todos los usuarios:
    res.status(200).json(result);

    // Si solo quieres mostrar la versión (como en tu ejemplo):
    // const { version } = result[0];
    // res.writeHead(200, { "Content-Type": "text/plain" });
    // res.end(version);
  } catch (error) {
    console.error('Error al consultar la base de datos:', error);
    res.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

module.exports = router;