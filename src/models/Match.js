const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  },
  players: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    position: Number,
    finalTiles: [[Number]],
    finalScore: Number,
    coinsWon: {
      type: Number,
      default: 0
    },
    coinsLost: {
      type: Number,
      default: 0
    }
  }],
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  winType: {
    type: String,
    enum: ['domino', 'blocked', 'points'],
    default: null
  },
  bet: {
    type: Number,
    required: true
  },
  totalPot: {
    type: Number,
    required: true
  },
  movesLog: [{
    playerId: mongoose.Schema.Types.ObjectId,
    playerName: String,
    action: String,
    tile: [Number],
    side: String,
    timestamp: Date
  }],
  duration: {
    type: Number,
    default: 0
  },
  startedAt: {
    type: Date,
    required: true
  },
  finishedAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Índices para búsquedas rápidas
matchSchema.index({ 'players.userId': 1 });
matchSchema.index({ winner: 1 });
matchSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Match', matchSchema);

