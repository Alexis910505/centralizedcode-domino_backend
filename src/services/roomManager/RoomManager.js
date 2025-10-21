const Room = require('../../models/Room');
const User = require('../../models/User');
const { ROOM_STATUS, MIN_PLAYERS, MAX_PLAYERS } = require('../../config/constants');

class RoomManager {
  constructor() {
    this.activeRooms = new Map(); // roomId -> room data
  }

  // Crear nueva sala
  async createRoom(hostId, options) {
    const { bet, maxPlayers = 4, isPrivate = false, name = 'Sala de Dominó' } = options;

    // Verificar que el host existe y tiene suficientes fichas
    const host = await User.findById(hostId);
    if (!host) {
      throw new Error('Usuario no encontrado');
    }

    if (host.coins < bet) {
      throw new Error('No tienes suficientes fichas para crear esta sala');
    }

    if (host.currentRoom) {
      throw new Error('Ya estás en una sala');
    }

    // Generar código único para la sala
    let roomCode;
    let codeExists = true;
    
    while (codeExists) {
      roomCode = Room.generateRoomCode();
      const existing = await Room.findOne({ roomCode });
      codeExists = !!existing;
    }

    // Crear la sala
    const room = await Room.create({
      roomCode,
      name,
      host: hostId,
      players: [{
        userId: hostId,
        position: 0,
        isReady: true
      }],
      maxPlayers,
      bet,
      isPrivate,
      status: ROOM_STATUS.WAITING
    });

    // Actualizar usuario
    host.currentRoom = room._id;
    await host.save();

    this.activeRooms.set(room._id.toString(), room);

    return room;
  }

  // Unirse a una sala
  async joinRoom(userId, roomId, socketId) {
    const room = await Room.findById(roomId).populate('players.userId', 'name avatar coins');
    if (!room) {
      throw new Error('Sala no encontrada');
    }

    if (room.status !== ROOM_STATUS.WAITING) {
      throw new Error('La partida ya comenzó');
    }

    if (room.isFull()) {
      throw new Error('La sala está llena');
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (user.currentRoom) {
      throw new Error('Ya estás en una sala');
    }

    if (user.coins < room.bet) {
      throw new Error('No tienes suficientes fichas para unirte');
    }

    if (room.hasPlayer(userId)) {
      throw new Error('Ya estás en esta sala');
    }

    // Agregar jugador
    room.players.push({
      userId,
      socketId,
      position: room.players.length,
      isReady: false
    });

    await room.save();

    // Actualizar usuario
    user.currentRoom = room._id;
    await user.save();

    this.activeRooms.set(room._id.toString(), room);

    return room;
  }

  // Salir de una sala
  async leaveRoom(userId, roomId) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Sala no encontrada');
    }

    const playerIndex = room.players.findIndex(
      p => p.userId.toString() === userId.toString()
    );

    if (playerIndex === -1) {
      throw new Error('No estás en esta sala');
    }

    // Remover jugador
    room.players.splice(playerIndex, 1);

    // Si la sala queda vacía, eliminarla
    if (room.players.length === 0) {
      await Room.findByIdAndDelete(roomId);
      this.activeRooms.delete(roomId.toString());
      return { roomDeleted: true };
    }

    // Si el host se fue, asignar nuevo host
    if (room.host.toString() === userId.toString()) {
      room.host = room.players[0].userId;
    }

    await room.save();

    // Actualizar usuario
    const user = await User.findById(userId);
    if (user) {
      user.currentRoom = null;
      await user.save();
    }

    return { roomDeleted: false, room };
  }

  // Marcar jugador como listo
  async setPlayerReady(userId, roomId, isReady) {
    const room = await Room.findById(roomId);
    if (!room) {
      throw new Error('Sala no encontrada');
    }

    const player = room.players.find(
      p => p.userId.toString() === userId.toString()
    );

    if (!player) {
      throw new Error('No estás en esta sala');
    }

    player.isReady = isReady;
    await room.save();

    return room;
  }

  // Verificar si todos están listos
  allPlayersReady(room) {
    if (room.players.length < MIN_PLAYERS) {
      return false;
    }
    return room.players.every(p => p.isReady);
  }

  // Obtener salas disponibles
  async getAvailableRooms(page = 1, limit = 20) {
    const skip = (page - 1) * limit;

    const rooms = await Room.find({
      status: ROOM_STATUS.WAITING,
      isPrivate: false
    })
      .populate('host', 'name avatar')
      .populate('players.userId', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Room.countDocuments({
      status: ROOM_STATUS.WAITING,
      isPrivate: false
    });

    return {
      rooms,
      total,
      page,
      pages: Math.ceil(total / limit)
    };
  }

  // Obtener sala por código
  async getRoomByCode(roomCode) {
    const room = await Room.findOne({ roomCode })
      .populate('host', 'name avatar coins')
      .populate('players.userId', 'name avatar coins');
    
    return room;
  }

  // Actualizar socket ID de un jugador
  async updatePlayerSocket(userId, roomId, socketId) {
    const room = await Room.findById(roomId);
    if (!room) return null;

    const player = room.players.find(
      p => p.userId.toString() === userId.toString()
    );

    if (player) {
      player.socketId = socketId;
      await room.save();
    }

    return room;
  }

  // Limpiar salas abandonadas (ejecutar periódicamente)
  async cleanupAbandonedRooms() {
    const timeout = 30 * 60 * 1000; // 30 minutos
    const cutoff = new Date(Date.now() - timeout);

    const abandoned = await Room.find({
      status: ROOM_STATUS.WAITING,
      createdAt: { $lt: cutoff }
    });

    for (const room of abandoned) {
      // Liberar jugadores
      for (const player of room.players) {
        const user = await User.findById(player.userId);
        if (user) {
          user.currentRoom = null;
          await user.save();
        }
      }

      await Room.findByIdAndDelete(room._id);
      this.activeRooms.delete(room._id.toString());
    }

    return abandoned.length;
  }
}

module.exports = new RoomManager();

