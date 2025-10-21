const { Server } = require('socket.io');
const { verifySocketToken } = require('../middleware/auth');
const gameEvents = require('./events/gameEvents');
const roomEvents = require('./events/roomEvents');

// Mapa de usuarios conectados
const connectedUsers = new Map(); // userId -> socketId

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.SOCKET_CORS_ORIGIN?.split(',') || '*',
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Middleware de autenticación
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Token no proporcionado'));
      }

      const user = await verifySocketToken(token);
      if (!user) {
        return next(new Error('Token inválido'));
      }

      socket.userId = user._id.toString();
      socket.userData = user;
      
      next();
    } catch (error) {
      next(new Error('Autenticación fallida'));
    }
  });

  // Manejo de conexiones
  io.on('connection', (socket) => {
    console.log(`✅ Usuario conectado: ${socket.userData.name} (${socket.userId})`);
    
    // Registrar usuario conectado
    connectedUsers.set(socket.userId, socket.id);

    // Notificar al usuario que está conectado
    socket.emit('connected', {
      userId: socket.userId,
      name: socket.userData.name
    });

    // Registrar eventos de sala
    roomEvents.registerRoomEvents(socket, io, connectedUsers);

    // Registrar eventos de juego
    gameEvents.registerGameEvents(socket, io, connectedUsers);

    // Manejo de desconexión
    socket.on('disconnect', () => {
      console.log(`❌ Usuario desconectado: ${socket.userData.name}`);
      connectedUsers.delete(socket.userId);
      
      // Manejar desconexión en sala
      roomEvents.handleDisconnect(socket, io);
    });

    // Ping/Pong para mantener conexión
    socket.on('ping', () => {
      socket.emit('pong');
    });
  });

  return io;
};

module.exports = { initializeSocket, connectedUsers };

