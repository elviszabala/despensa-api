const express = require('express');
const cors = require('cors');
const recetasRoutes = require('./routes/recetas');
const authRoutes = require('./routes/auth');
const testRoutes = require('./routes/test');
const itemsRoutes = require('./routes/items');
const usersRoutes = require('./routes/users');
const rateLimiter = require('./middlewares/rateLimiter');
const router = express.Router();
const morgan = require('morgan');
//const pool = require('./db/neonClient') // Importar el cliente de la base de datos
const dotenv = require('dotenv');// Importar dotenv para manejar variables de entorno
dotenv.config(); // Cargar variables de entorno desde .env


const app = express();
app.use(express.json());



// Configurar CORS
app.use(cors({
  origin: 'http://localhost:8000',
  methods: ['GET', 'POST'],
  credentials: true
}));

// Middleware para registrar las peticiones
app.use(morgan('dev'));
app.use(rateLimiter); // Limita exceso de peticiones

// Rutas
router.get('/', (req, res) => {
 //console.log('Petición recibida en la ruta raíz /');
  // Envía una respuesta al cliente
 res.send(`API funcionando correctamente: ${process.env.TEST_ELVISZABALA}`);

});





app.use('/', router);
app.use('/api/auth', authRoutes);
app.use('/api/recetas', recetasRoutes);
app.use('/api/test', testRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/users', usersRoutes);

app.listen(8000, () => {
  console.log('Servidor corriendo en puerto 8000');
});
