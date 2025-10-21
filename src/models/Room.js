const mongoose = require('mongoose');
const { ROOM_STATUS, MIN_PLAYERS, MAX_PLAYERS } = require('../config/constants');

const roomSchema = new mongoose.Schema({
  roomCode: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    default: 'Sala de Dominó'
  },
  host: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    socketId: String,
    position: Number,
    isReady: {
      type: Boolean,
      default: false
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  maxPlayers: {
    type: Number,
    default: 4,
    min: MIN_PLAYERS,
    max: MAX_PLAYERS
  },
  bet: {
    type: Number,
    required: true,
    min: 10
  },
  status: {
    type: String,
    enum: Object.values(ROOM_STATUS),
    default: ROOM_STATUS.WAITING
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    default: null
  },
  gameState: {
    board: [{
      tile: [Number],
      playedBy: mongoose.Schema.Types.ObjectId
    }],
    currentTurn: mongoose.Schema.Types.ObjectId,
    turnOrder: [mongoose.Schema.Types.ObjectId],
    playerHands: [{
      userId: mongoose.Schema.Types.ObjectId,
      tiles: [[Number]],
      tilesCount: Number
    }],
    boneyard: [[Number]],
    passCount: {
      type: Number,
      default: 0
    },
    movesLog: [{
      playerId: mongoose.Schema.Types.ObjectId,
      action: String,
      tile: [Number],
      side: String,
      timestamp: Date
    }]
  },
  startedAt: {
    type: Date,
    default: null
  },
  finishedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Generar código único para la sala
roomSchema.statics.generateRoomCode = function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Verificar si la sala está llena
roomSchema.methods.isFull = function() {
  return this.players.length >= this.maxPlayers;
};

// Verificar si un usuario está en la sala
roomSchema.methods.hasPlayer = function(userId) {
  return this.players.some(p => p.userId.toString() === userId.toString());
};

// Obtener el siguiente jugador en el turno
roomSchema.methods.getNextPlayer = function() {
  if (!this.gameState.currentTurn || !this.gameState.turnOrder.length) {
    return null;
  }
  
  const currentIndex = this.gameState.turnOrder.findIndex(
    id => id.toString() === this.gameState.currentTurn.toString()
  );
  
  const nextIndex = (currentIndex + 1) % this.gameState.turnOrder.length;
  return this.gameState.turnOrder[nextIndex];
};

module.exports = mongoose.model('Room', roomSchema);

