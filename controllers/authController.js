const jwt = require('jsonwebtoken');
//const usuarios = require('../data/usuarios.json');
//const { claveSecreta } = require('../config/jwt');


const dotenv = require('dotenv');
dotenv.config();
const login = (req, res) => {

  console.log('Petición recibida la info es:', req.body);
  
  if (!req.body || !req.body.usuario || !req.body.password) {
    return res.status(400).json({ mensaje: 'Usuario y contraseña son requeridos' });
  }

  const { usuario, password } = req.body;
  const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

  if (!encontrado) {
    return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
  }

  const token = jwt.sign({ usuario: encontrado.usuario }, process.env.JWT_SECRET, { expiresIn: '2h' });
  res.json({ token });
};

module.exports = { login };
