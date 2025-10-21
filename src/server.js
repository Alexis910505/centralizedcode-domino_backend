require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const { initializeSocket } = require('./socket/socketHandler');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const roomRoutes = require('./routes/roomRoutes');
const matchRoutes = require('./routes/matchRoutes');

// Inicializar Express
const app = express();
const server = http.createServer(app);

// Conectar a MongoDB
connectDB();

// Inicializar Socket.io
const io = initializeSocket(server);

// Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Desactivar CSP para Swagger UI
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logger en desarrollo
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Documentación Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Dominó - Documentación',
}));

// Ruta para obtener el JSON de Swagger
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'API de Dominó Multijugador',
    version: '1.0.0',
    documentation: '/api-docs',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      rooms: '/api/rooms',
      matches: '/api/matches'
    }
  });
});

// Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/matches', matchRoutes);

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Middleware de manejo de errores
app.use(errorHandler);

// Puerto
const PORT = process.env.PORT || 3000;

// Iniciar servidor
server.listen(PORT, () => {
  console.log('');
  console.log('═══════════════════════════════════════════════');
  console.log('🎲  SERVIDOR DE DOMINÓ MULTIJUGADOR');
  console.log('═══════════════════════════════════════════════');
  console.log(`🚀  Servidor corriendo en puerto ${PORT}`);
  console.log(`🌍  Modo: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡  WebSocket: Activo`);
  console.log(`📚  Documentación: http://localhost:${PORT}/api-docs`);
  console.log('═══════════════════════════════════════════════');
  console.log('');
});

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error('❌ Error no manejado:', err);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM recibido. Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente');
    process.exit(0);
  });
});

module.exports = { app, server, io };

