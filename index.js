const express = require('express');
const cors = require('cors');
const recetasRoutes = require('./routes/recetas');
const authRoutes = require('./routes/auth');
const rateLimiter = require('./middlewares/rateLimiter');
const router = express.Router();

const app = express();
app.use(express.json());

const texto = 'Mi texto';

// Configurar CORS
app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(rateLimiter); // Limita exceso de peticiones

// Rutas
router.get('/', (req, res) => {
 console.log('Petición recibida en la ruta raíz /', req);
  // Envía una respuesta al cliente
 res.send('API funcionando correctamente'); 
});
app.use('/', router);
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetasRoutes);

app.listen(8000, () => {
  console.log('Servidor corriendo en puerto 8000');
});
