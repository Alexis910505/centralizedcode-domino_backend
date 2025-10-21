require('dotenv').config();
const mongoose = require('mongoose');
const RoomManager = require('../src/services/roomManager/RoomManager');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

const cleanup = async () => {
  try {
    console.log('🧹 Limpiando salas abandonadas...');
    
    const cleaned = await RoomManager.cleanupAbandonedRooms();
    
    console.log(`✅ ${cleaned} salas limpiadas`);

  } catch (error) {
    console.error('❌ Error en limpieza:', error);
  }
};

const main = async () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('🧹  LIMPIEZA DE SALAS ABANDONADAS');
  console.log('═══════════════════════════════════════');
  console.log('');

  await connectDB();
  await cleanup();

  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('✅  LIMPIEZA COMPLETADA');
  console.log('═══════════════════════════════════════');
  console.log('');

  process.exit(0);
};

main();

