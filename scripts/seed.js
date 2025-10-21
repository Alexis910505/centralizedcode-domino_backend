require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../src/models/User');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error de conexión:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Limpiar usuarios existentes
    await User.deleteMany({});
    console.log('🗑️  Usuarios anteriores eliminados');

    // Crear usuarios de prueba
    const users = [
      {
        name: 'Jugador 1',
        email: 'jugador1@test.com',
        password: 'password123',
        avatar: 'avatar1.png',
        country: 'México',
        coins: 5000
      },
      {
        name: 'Jugador 2',
        email: 'jugador2@test.com',
        password: 'password123',
        avatar: 'avatar2.png',
        country: 'Argentina',
        coins: 3000
      },
      {
        name: 'Jugador 3',
        email: 'jugador3@test.com',
        password: 'password123',
        avatar: 'avatar3.png',
        country: 'Colombia',
        coins: 4000
      },
      {
        name: 'Jugador 4',
        email: 'jugador4@test.com',
        password: 'password123',
        avatar: 'avatar4.png',
        country: 'España',
        coins: 2500
      }
    ];

    await User.create(users);
    console.log('✅ Usuarios de prueba creados exitosamente');
    console.log('');
    console.log('📋 Usuarios creados:');
    users.forEach(user => {
      console.log(`   - ${user.name} (${user.email}) - ${user.coins} fichas`);
    });
    console.log('');
    console.log('🔑 Contraseña para todos: password123');

  } catch (error) {
    console.error('❌ Error al crear usuarios:', error);
  }
};

const main = async () => {
  console.log('');
  console.log('═══════════════════════════════════════');
  console.log('🌱  INICIALIZANDO BASE DE DATOS');
  console.log('═══════════════════════════════════════');
  console.log('');

  await connectDB();
  await seedUsers();

  console.log('═══════════════════════════════════════');
  console.log('✅  PROCESO COMPLETADO');
  console.log('═══════════════════════════════════════');
  console.log('');

  process.exit(0);
};

main();

