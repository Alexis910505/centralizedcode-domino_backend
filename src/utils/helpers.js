// Utilidades y funciones auxiliares

// Generar código alfanumérico aleatorio
exports.generateCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

// Calcular porcentaje de victoria
exports.calculateWinRate = (wins, totalGames) => {
  if (totalGames === 0) return 0;
  return Math.round((wins / totalGames) * 100);
};

// Formatear tiempo de duración
exports.formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${secs}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};

// Validar formato de email
exports.isValidEmail = (email) => {
  const regex = /^\S+@\S+\.\S+$/;
  return regex.test(email);
};

// Sanitizar nombre de usuario
exports.sanitizeName = (name) => {
  return name.trim().replace(/[^a-zA-Z0-9áéíóúñÑ\s]/g, '');
};

// Obtener hora actual en formato ISO
exports.getCurrentTimestamp = () => {
  return new Date().toISOString();
};

// Delay asíncrono
exports.delay = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

