const mongoose = require('mongoose');
const { TRANSACTION_TYPES } = require('../config/constants');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: Object.values(TRANSACTION_TYPES),
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  balanceBefore: {
    type: Number,
    required: true
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    default: null
  },
  description: {
    type: String,
    default: ''
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices
transactionSchema.index({ userId: 1, createdAt: -1 });
transactionSchema.index({ type: 1 });

module.exports = mongoose.model('Transaction', transactionSchema);

