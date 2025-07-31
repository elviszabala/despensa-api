const recetas = require('../data/recetas.json');
const { validationResult } = require('express-validator');

const getRecetas = (req, res) => {
  res.json(recetas);
};

const crearReceta = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(400).json({ errores: errores.array() });
  }

  const nuevaReceta = req.body;
  recetas.push(nuevaReceta);
  res.status(201).json({ mensaje: 'Receta creada', receta: nuevaReceta });
};

module.exports = { getRecetas, crearReceta };
