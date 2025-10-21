const Room = require('../../models/Room');
const User = require('../../models/User');
const RoomManager = require('../../services/roomManager/RoomManager');
const BetManager = require('../../services/betSystem/BetManager');
const { ROOM_STATUS } = require('../../config/constants');

// Registrar eventos de sala
exports.registerRoomEvents = (socket, io, connectedUsers) => {
  // Unirse a una sala
  socket.on('join_room', async (data) => {
    try {
      const { roomId } = data;
      
      const room = await RoomManager.joinRoom(socket.userId, roomId, socket.id);
      
      // Unirse al canal de Socket.io
      socket.join(roomId);
      
      // Notificar al jugador
      socket.emit('room_joined', {
        success: true,
        room
      });

      // Notificar a todos en la sala
      io.to(roomId).emit('player_joined', {
        playerId: socket.userId,
        playerName: socket.userData.name,
        room
      });

    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  });

  // Salir de una sala
  socket.on('leave_room', async (data) => {
    try {
      const { roomId } = data;
      
      const result = await RoomManager.leaveRoom(socket.userId, roomId);
      
      // Salir del canal de Socket.io
      socket.leave(roomId);
      
      // Notificar al jugador
      socket.emit('room_left', {
        success: true
      });

      // Si la sala no fue eliminada, notificar a los demás
      if (!result.roomDeleted) {
        io.to(roomId).emit('player_left', {
          playerId: socket.userId,
          playerName: socket.userData.name,
          room: result.room
        });
      }

    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  });

  // Marcar como listo
  socket.on('ready', async (data) => {
    try {
      const { roomId, isReady } = data;
      
      const room = await RoomManager.setPlayerReady(socket.userId, roomId, isReady);
      
      // Notificar a todos en la sala
      io.to(roomId).emit('player_ready', {
        playerId: socket.userId,
        isReady,
        room
      });

      // Verificar si todos están listos para iniciar
      if (RoomManager.allPlayersReady(room)) {
        io.to(roomId).emit('all_ready', {
          message: 'Todos los jugadores están listos. Iniciando partida...'
        });
      }

    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  });

  // Listar salas disponibles
  socket.on('list_rooms', async (data) => {
    try {
      const { page = 1, limit = 20 } = data;
      const result = await RoomManager.getAvailableRooms(page, limit);
      
      socket.emit('rooms_list', result);
    } catch (error) {
      socket.emit('error', {
        message: error.message
      });
    }
  });
};

// Manejar desconexión
exports.handleDisconnect = async (socket, io) => {
  try {
    const user = await User.findById(socket.userId);
    if (!user || !user.currentRoom) return;

    const roomId = user.currentRoom.toString();
    const result = await RoomManager.leaveRoom(socket.userId, roomId);

    // Notificar a los demás
    if (!result.roomDeleted) {
      io.to(roomId).emit('player_disconnected', {
        playerId: socket.userId,
        playerName: socket.userData.name,
        message: `${socket.userData.name} se desconectó`
      });
    }
  } catch (error) {
    console.error('Error en handleDisconnect:', error);
  }
};

