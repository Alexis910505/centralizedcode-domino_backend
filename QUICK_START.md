# 🚀 Guía Rápida - Backend Dominó

## Inicio Rápido (5 minutos)

### 1. Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores (especialmente JWT_SECRET y MONGODB_URI)
```

### 2. Iniciar MongoDB

**Opción A: MongoDB Local**
```bash
# Asegúrate de tener MongoDB instalado y corriendo
mongod
```

**Opción B: MongoDB Atlas (Cloud)**
- Crea una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Crea un cluster gratuito
- Obtén la URI de conexión
- Actualiza `MONGODB_URI` en tu archivo `.env`

### 3. Iniciar el Servidor

```bash
# Desarrollo (con auto-reload)
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

### 4. (Opcional) Crear Usuarios de Prueba

```bash
npm run seed
```

Esto creará 4 usuarios de prueba:
- Email: `jugador1@test.com` - Contraseña: `password123`
- Email: `jugador2@test.com` - Contraseña: `password123`
- Email: `jugador3@test.com` - Contraseña: `password123`
- Email: `jugador4@test.com` - Contraseña: `password123`

---

## Prueba Rápida con cURL

### 1. Registrar Usuario
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Guarda el token de la respuesta!**

### 3. Ver Perfil
```bash
curl http://localhost:3000/api/auth/profile \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

### 4. Crear Sala
```bash
curl -X POST http://localhost:3000/api/rooms/create \
  -H "Authorization: Bearer TU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "bet": 100,
    "maxPlayers": 4,
    "name": "Mi Sala"
  }'
```

---

## Estructura del Proyecto

```
domino_backend/
├── src/
│   ├── config/              # Configuración de BD y constantes
│   │   ├── database.js
│   │   └── constants.js
│   ├── models/              # Modelos de Mongoose
│   │   ├── User.js
│   │   ├── Room.js
│   │   ├── Match.js
│   │   └── Transaction.js
│   ├── controllers/         # Controladores de rutas
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── roomController.js
│   │   └── matchController.js
│   ├── routes/              # Rutas de la API
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── roomRoutes.js
│   │   └── matchRoutes.js
│   ├── middleware/          # Middleware
│   │   ├── auth.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── services/            # Lógica de negocio
│   │   ├── gameEngine/
│   │   │   └── DominoEngine.js
│   │   ├── betSystem/
│   │   │   └── BetManager.js
│   │   └── roomManager/
│   │       └── RoomManager.js
│   ├── socket/              # Socket.io
│   │   ├── socketHandler.js
│   │   └── events/
│   │       ├── roomEvents.js
│   │       └── gameEvents.js
│   ├── utils/               # Utilidades
│   │   ├── helpers.js
│   │   └── constants.js
│   └── server.js            # Punto de entrada
├── scripts/                 # Scripts de utilidad
│   ├── seed.js
│   └── cleanup.js
├── package.json
├── .env.example
├── README.md
├── API_DOCUMENTATION.md
├── DEPLOYMENT.md
└── TESTING.md
```

---

## Endpoints Principales

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `GET /api/auth/profile` - Obtener perfil

### Usuarios
- `GET /api/users/:id` - Obtener usuario
- `PATCH /api/users/profile/update` - Actualizar perfil
- `POST /api/users/daily-bonus` - Reclamar bonus diario
- `GET /api/users/leaderboard/top` - Ranking

### Salas
- `GET /api/rooms` - Listar salas
- `POST /api/rooms/create` - Crear sala
- `GET /api/rooms/:code` - Obtener sala
- `POST /api/rooms/:id/join` - Unirse
- `POST /api/rooms/:id/leave` - Salir

### Partidas
- `GET /api/matches/history/:userId` - Historial
- `GET /api/matches/:id` - Detalle de partida
- `GET /api/matches/stats/general` - Estadísticas

---

## Eventos Socket.io

### Cliente → Servidor
- `join_room` - Unirse a sala
- `leave_room` - Salir de sala
- `ready` - Marcar como listo
- `start_game` - Iniciar partida
- `play_tile` - Jugar ficha
- `pass_turn` - Pasar turno

### Servidor → Cliente
- `connected` - Conexión exitosa
- `room_joined` - Sala unida
- `player_joined` - Jugador se unió
- `player_left` - Jugador salió
- `game_started` - Partida iniciada
- `tiles_dealt` - Fichas repartidas
- `tile_played` - Ficha jugada
- `turn_passed` - Turno pasado
- `game_ended` - Partida terminada
- `error` - Error

---

## Scripts Útiles

```bash
# Iniciar en desarrollo
npm run dev

# Iniciar en producción
npm start

# Crear usuarios de prueba
npm run seed

# Limpiar salas abandonadas
npm run cleanup
```

---

## Docker (Alternativa Rápida)

Si prefieres usar Docker:

```bash
# Iniciar todo (Backend + MongoDB)
docker-compose up -d

# Ver logs
docker-compose logs -f backend

# Detener
docker-compose down
```

Servicios disponibles:
- Backend: `http://localhost:3000`
- MongoDB: `localhost:27017`
- Mongo Express (Admin): `http://localhost:8081`

---

## Variables de Entorno Importantes

```env
# REQUERIDO: Cambia esto en producción!
JWT_SECRET=tu_clave_secreta_muy_segura_aqui

# MongoDB
MONGODB_URI=mongodb://localhost:27017/domino_game

# Configuración del juego
INITIAL_COINS=1000      # Fichas iniciales
DAILY_BONUS=100         # Bonus diario
MIN_BET=10              # Apuesta mínima
MAX_BET=10000           # Apuesta máxima
```

---

## Solución de Problemas Comunes

### Error: Cannot connect to MongoDB
```bash
# Verifica que MongoDB esté corriendo
# En Linux/Mac:
sudo systemctl status mongod

# En Windows:
# Verifica el servicio en Services.msc
```

### Error: Port 3000 already in use
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error: Module not found
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

---

## Próximos Pasos

1. ✅ **Lee la documentación completa**: `API_DOCUMENTATION.md`
2. ✅ **Prueba los endpoints**: Usa Thunder Client, Postman o cURL
3. ✅ **Integra con Flutter**: Conecta tu app móvil al backend
4. ✅ **Despliega en producción**: Consulta `DEPLOYMENT.md`

---

## Recursos Adicionales

- **Documentación API**: `API_DOCUMENTATION.md`
- **Guía de Despliegue**: `DEPLOYMENT.md`
- **Guía de Pruebas**: `TESTING.md`
- **README Principal**: `README.md`

---

## Contacto

¿Problemas o preguntas? Contacta al equipo de desarrollo.

---

**¡Listo para jugar! 🎲**

