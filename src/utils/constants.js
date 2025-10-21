// Mensajes y constantes adicionales

module.exports = {
  MESSAGES: {
    // Autenticación
    AUTH_SUCCESS: 'Autenticación exitosa',
    AUTH_FAILED: 'Autenticación fallida',
    INVALID_CREDENTIALS: 'Credenciales inválidas',
    TOKEN_EXPIRED: 'Token expirado',
    UNAUTHORIZED: 'No autorizado',
    
    // Usuarios
    USER_NOT_FOUND: 'Usuario no encontrado',
    USER_CREATED: 'Usuario creado exitosamente',
    USER_UPDATED: 'Usuario actualizado exitosamente',
    EMAIL_EXISTS: 'El email ya está registrado',
    
    // Salas
    ROOM_NOT_FOUND: 'Sala no encontrada',
    ROOM_FULL: 'La sala está llena',
    ROOM_CREATED: 'Sala creada exitosamente',
    ALREADY_IN_ROOM: 'Ya estás en una sala',
    NOT_IN_ROOM: 'No estás en esta sala',
    
    // Juego
    GAME_STARTED: 'Partida iniciada',
    GAME_ENDED: 'Partida finalizada',
    NOT_YOUR_TURN: 'No es tu turno',
    INVALID_MOVE: 'Jugada inválida',
    TILE_NOT_FOUND: 'Ficha no encontrada',
    
    // Fichas/Apuestas
    INSUFFICIENT_COINS: 'No tienes suficientes fichas',
    BET_TOO_LOW: 'La apuesta es muy baja',
    BET_TOO_HIGH: 'La apuesta es muy alta',
    DAILY_BONUS_CLAIMED: 'Bonus diario reclamado',
    ALREADY_CLAIMED: 'Ya reclamaste tu bonus diario',
    
    // Errores generales
    SERVER_ERROR: 'Error del servidor',
    VALIDATION_ERROR: 'Error de validación',
    NOT_FOUND: 'No encontrado',
  },
  
  AVATARS: [
    'avatar1.png',
    'avatar2.png',
    'avatar3.png',
    'avatar4.png',
    'avatar5.png',
    'avatar6.png',
    'avatar7.png',
    'avatar8.png',
  ],
  
  COUNTRIES: [
    'Argentina', 'Chile', 'Colombia', 'España', 
    'Estados Unidos', 'México', 'Perú', 'Venezuela'
  ],
};

