const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: 3,
    maxlength: 30
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6,
    select: false
  },
  avatar: {
    type: String,
    default: 'avatar1.png'
  },
  country: {
    type: String,
    default: 'Unknown'
  },
  coins: {
    type: Number,
    default: function() {
      return parseInt(process.env.INITIAL_COINS) || 1000;
    }
  },
  stats: {
    wins: {
      type: Number,
      default: 0
    },
    losses: {
      type: Number,
      default: 0
    },
    draws: {
      type: Number,
      default: 0
    },
    totalGames: {
      type: Number,
      default: 0
    },
    totalCoinsWon: {
      type: Number,
      default: 0
    },
    totalCoinsLost: {
      type: Number,
      default: 0
    }
  },
  lastDailyBonus: {
    type: Date,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  currentRoom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash de contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método para obtener perfil público
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    avatar: this.avatar,
    country: this.country,
    coins: this.coins,
    stats: this.stats,
    isOnline: this.isOnline
  };
};

// Método para verificar si puede reclamar bonus diario
userSchema.methods.canClaimDailyBonus = function() {
  if (!this.lastDailyBonus) return true;
  
  const now = new Date();
  const lastBonus = new Date(this.lastDailyBonus);
  const diffHours = Math.abs(now - lastBonus) / 36e5;
  
  return diffHours >= 24;
};

module.exports = mongoose.model('User', userSchema);

