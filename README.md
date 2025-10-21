# Backend de Dominó Multijugador 🎲

Backend completo para juego de dominó multijugador con apuestas virtuales, desarrollado con Node.js, Express y Socket.io.

## 🚀 Características

- ✅ Autenticación y gestión de usuarios
- ✅ Sistema de partidas en tiempo real (2-4 jugadores)
- ✅ Motor de juego de dominó con validación de reglas
- ✅ Sistema de apuestas virtuales con fichas
- ✅ Comunicación en tiempo real con Socket.io
- ✅ Historial de partidas y estadísticas
- ✅ Recompensas diarias
- ✅ Sistema de seguridad y validación
- ✅ **Documentación interactiva con Swagger UI** 📚

## 📋 Requisitos

- Node.js >= 16.x
- MongoDB >= 5.x
- npm o yarn

## 🔧 Instalación

1. Clona el repositorio
2. Instala las dependencias:
```bash
npm install
```

3. Copia el archivo de configuración:
```bash
cp .env.example .env
```

4. Configura las variables de entorno en `.env`

5. Inicia el servidor:
```bash
# Desarrollo
npm run dev

# Producción
npm start
```

6. Accede a la documentación interactiva:
```
http://localhost:3000/api-docs
```

🎉 **¡Documentación Swagger UI disponible!** Explora y prueba todos los endpoints desde tu navegador.

## 📁 Estructura del Proyecto

```
domino_backend/
├── src/
│   ├── config/          # Configuración de BD y app
│   ├── models/          # Modelos de Mongoose
│   ├── controllers/     # Controladores de rutas
│   ├── routes/          # Rutas de la API
│   ├── middleware/      # Middleware de autenticación y validación
│   ├── services/        # Lógica de negocio
│   │   ├── gameEngine/  # Motor del juego de dominó
│   │   ├── betSystem/   # Sistema de apuestas
│   │   └── roomManager/ # Gestión de salas
│   ├── socket/          # Eventos de Socket.io
│   └── server.js        # Punto de entrada
├── package.json
├── .env.example
└── README.md
```

## 🌐 API Endpoints

### 📚 Documentación Interactiva
**Swagger UI**: `http://localhost:3000/api-docs`
- ✨ Interfaz visual interactiva
- ✨ Prueba endpoints en vivo
- ✨ Autenticación JWT integrada
- ✨ Ejemplos de peticiones y respuestas

👉 **Ver guía completa**: [SWAGGER_GUIDE.md](SWAGGER_GUIDE.md)

### Autenticación y Usuarios
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/users/:id` - Obtener perfil de usuario
- `PATCH /api/users/:id` - Actualizar perfil
- `POST /api/users/daily-bonus` - Reclamar bonus diario

### Partidas
- `GET /api/rooms` - Listar salas disponibles
- `POST /api/rooms/create` - Crear nueva sala
- `POST /api/rooms/:id/join` - Unirse a sala
- `POST /api/rooms/:id/leave` - Salir de sala
- `GET /api/rooms/:id` - Obtener info de sala

### Historial
- `GET /api/matches/history/:userId` - Historial de partidas
- `GET /api/matches/:id` - Detalle de partida

📖 **Documentación completa**: Ver todos los 17 endpoints en `/api-docs`

## 🎮 Eventos Socket.io

### Cliente → Servidor
- `join_room` - Unirse a una sala
- `leave_room` - Salir de una sala
- `start_game` - Iniciar partida
- `play_tile` - Jugar una ficha
- `pass_turn` - Pasar turno
- `disconnect` - Desconexión

### Servidor → Cliente
- `room_joined` - Confirmación de ingreso a sala
- `player_joined` - Nuevo jugador en sala
- `player_left` - Jugador salió de sala
- `game_started` - Partida iniciada
- `tiles_dealt` - Fichas repartidas
- `tile_played` - Ficha jugada
- `turn_changed` - Cambio de turno
- `game_ended` - Partida terminada
- `error` - Error en operación

## 🔒 Seguridad

- Autenticación con JWT
- Validación de todas las jugadas en servidor
- Protección contra trampas
- Validación de turnos
- Control de fichas virtuales solo en servidor

## 📊 Base de Datos

### Colecciones
- `users` - Información de usuarios
- `rooms` - Salas activas
- `matches` - Historial de partidas
- `transactions` - Movimientos de fichas

## 🎯 Reglas del Juego

- 2 o 4 jugadores por partida
- 7 fichas por jugador al inicio
- 28 fichas en total ([0|0] a [6|6])
- Gana quien se queda sin fichas
- En caso de tranca, gana quien tenga menos puntos
- El ganador recibe todas las fichas apostadas

## 📝 Licencia

MIT

