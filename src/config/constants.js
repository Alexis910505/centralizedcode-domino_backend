module.exports = {
  // Configuración del juego
  INITIAL_COINS: parseInt(process.env.INITIAL_COINS) || 1000,
  DAILY_BONUS: parseInt(process.env.DAILY_BONUS) || 100,
  MIN_BET: parseInt(process.env.MIN_BET) || 10,
  MAX_BET: parseInt(process.env.MAX_BET) || 10000,
  
  // Estados de la sala
  ROOM_STATUS: {
    WAITING: 'waiting',
    PLAYING: 'playing',
    FINISHED: 'finished'
  },
  
  // Estados de la partida
  GAME_STATUS: {
    ACTIVE: 'active',
    ENDED: 'ended',
    BLOCKED: 'blocked'
  },
  
  // Número de jugadores
  MIN_PLAYERS: 2,
  MAX_PLAYERS: 4,
  
  // Fichas del dominó
  TILES_PER_PLAYER: 7,
  MAX_TILE_VALUE: 6,
  
  // Tipo de partida
  MATCH_TYPES: {
    CLASSIC: 'classic',
    QUICK: 'quick',
    TOURNAMENT: 'tournament'
  },
  
  // Transacciones
  TRANSACTION_TYPES: {
    WIN: 'win',
    LOSS: 'loss',
    DAILY_BONUS: 'daily_bonus',
    PURCHASE: 'purchase',
    REWARD: 'reward'
  }
};

