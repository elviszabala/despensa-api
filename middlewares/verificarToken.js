const jwt = require('jsonwebtoken');
//const { claveSecreta } = require('../config/jwt');
const dotenv = require('dotenv');
dotenv.config();

function verificarToken(req, res, next) {
  //console.log('Verificando token para la ruta:', req.headers);
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ mensaje: 'Token faltante' });

  jwt.verify(token, process.env.JWT_SECRET, (err, usuario) => {
    if (err) return res.status(401).json({ mensaje: 'Token inválido' });
    req.usuario = usuario;
    next();
  });
}

module.exports = verificarToken;
