# 📚 Documentación de la API - Dominó Multijugador

## Índice
1. [Autenticación](#autenticación)
2. [Usuarios](#usuarios)
3. [Salas](#salas)
4. [Partidas](#partidas)
5. [Eventos Socket.io](#eventos-socketio)

## Base URL
```
http://localhost:3000/api
```

---

## Autenticación

### Registro de Usuario
```http
POST /api/auth/register
```

**Body:**
```json
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123",
  "avatar": "avatar1.png",
  "country": "México"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "user": {
      "id": "64abc123...",
      "name": "Juan Pérez",
      "avatar": "avatar1.png",
      "country": "México",
      "coins": 1000,
      "stats": {...}
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```http
POST /api/auth/login
```

**Body:**
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### Logout
```http
POST /api/auth/logout
```

**Headers:**
```
Authorization: Bearer {token}
```

### Obtener Perfil
```http
GET /api/auth/profile
```

**Headers:**
```
Authorization: Bearer {token}
```

---

## Usuarios

### Obtener Usuario por ID
```http
GET /api/users/:id
```

### Actualizar Perfil
```http
PATCH /api/users/profile/update
```

**Body:**
```json
{
  "name": "Nuevo Nombre",
  "avatar": "avatar2.png",
  "country": "Argentina"
}
```

### Reclamar Bonus Diario
```http
POST /api/users/daily-bonus
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Bonus diario reclamado",
  "data": {
    "bonusAmount": 100,
    "newBalance": 1100
  }
}
```

### Obtener Estadísticas de Apuestas
```http
GET /api/users/betting/stats
```

### Obtener Ranking
```http
GET /api/users/leaderboard/top?limit=50&sortBy=wins
```

**Query Parameters:**
- `limit`: Número de resultados (default: 50)
- `sortBy`: Criterio de ordenamiento (`wins`, `coins`, `games`)

---

## Salas

### Listar Salas Disponibles
```http
GET /api/rooms?page=1&limit=20
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "rooms": [...],
    "total": 15,
    "page": 1,
    "pages": 1
  }
}
```

### Crear Sala
```http
POST /api/rooms/create
```

**Body:**
```json
{
  "bet": 100,
  "maxPlayers": 4,
  "isPrivate": false,
  "name": "Sala VIP"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Sala creada exitosamente",
  "data": {
    "roomCode": "ABC123",
    "name": "Sala VIP",
    "host": "64abc123...",
    "players": [...],
    "bet": 100,
    "status": "waiting"
  }
}
```

### Obtener Sala por Código
```http
GET /api/rooms/:code
```

### Unirse a Sala
```http
POST /api/rooms/:id/join
```

### Salir de Sala
```http
POST /api/rooms/:id/leave
```

---

## Partidas

### Obtener Historial de Usuario
```http
GET /api/matches/history/:userId?page=1&limit=20
```

### Obtener Detalle de Partida
```http
GET /api/matches/:id
```

**Respuesta:**
```json
{
  "success": true,
  "data": {
    "matchId": "64def456...",
    "players": [...],
    "winner": {...},
    "winType": "domino",
    "bet": 100,
    "totalPot": 400,
    "duration": 320,
    "movesLog": [...]
  }
}
```

### Obtener Estadísticas Generales
```http
GET /api/matches/stats/general
```

---

## Eventos Socket.io

### Conexión

**Cliente → Servidor:**
```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

**Servidor → Cliente:**
```javascript
socket.on('connected', (data) => {
  console.log('Conectado:', data);
});
```

---

### Eventos de Sala

#### Unirse a Sala
**Cliente → Servidor:**
```javascript
socket.emit('join_room', { roomId: '64abc123...' });
```

**Servidor → Cliente:**
```javascript
socket.on('room_joined', (data) => {
  console.log('Te uniste a la sala:', data.room);
});

socket.on('player_joined', (data) => {
  console.log(`${data.playerName} se unió a la sala`);
});
```

#### Salir de Sala
**Cliente → Servidor:**
```javascript
socket.emit('leave_room', { roomId: '64abc123...' });
```

#### Marcar como Listo
**Cliente → Servidor:**
```javascript
socket.emit('ready', { roomId: '64abc123...', isReady: true });
```

**Servidor → Cliente:**
```javascript
socket.on('player_ready', (data) => {
  console.log(`Jugador ${data.playerId} está listo:`, data.isReady);
});

socket.on('all_ready', (data) => {
  console.log('Todos listos, iniciando...');
});
```

---

### Eventos de Juego

#### Iniciar Partida
**Cliente → Servidor:**
```javascript
socket.emit('start_game', { roomId: '64abc123...' });
```

**Servidor → Cliente:**
```javascript
socket.on('game_started', (data) => {
  console.log('Partida iniciada');
  console.log('Turno actual:', data.currentTurn);
});

socket.on('tiles_dealt', (data) => {
  console.log('Mis fichas:', data.tiles);
  console.log('¿Es mi turno?:', data.isYourTurn);
});
```

#### Jugar una Ficha
**Cliente → Servidor:**
```javascript
socket.emit('play_tile', {
  roomId: '64abc123...',
  tile: [6, 5],
  side: 'left' // o 'right'
});
```

**Servidor → Cliente:**
```javascript
socket.on('tile_played', (data) => {
  console.log(`${data.playerName} jugó:`, data.tile);
  console.log('Tablero actual:', data.board);
  console.log('Turno siguiente:', data.currentTurn);
});
```

#### Pasar Turno
**Cliente → Servidor:**
```javascript
socket.emit('pass_turn', { roomId: '64abc123...' });
```

**Servidor → Cliente:**
```javascript
socket.on('turn_passed', (data) => {
  console.log(`${data.playerName} pasó su turno`);
  console.log('Pases consecutivos:', data.passCount);
});
```

#### Fin de Partida
**Servidor → Cliente:**
```javascript
socket.on('game_ended', (data) => {
  console.log('Partida terminada');
  console.log('Ganador:', data.winnerId);
  console.log('Tipo de victoria:', data.winType);
  console.log('Bote total:', data.totalPot);
  console.log('Puntuaciones finales:', data.finalScores);
});
```

---

### Eventos de Error

**Servidor → Cliente:**
```javascript
socket.on('error', (data) => {
  console.error('Error:', data.message);
});
```

---

## Códigos de Estado HTTP

- `200 OK` - Solicitud exitosa
- `201 Created` - Recurso creado exitosamente
- `400 Bad Request` - Error de validación
- `401 Unauthorized` - No autenticado
- `404 Not Found` - Recurso no encontrado
- `500 Internal Server Error` - Error del servidor

---

## Estructura de Respuesta

Todas las respuestas siguen este formato:

**Éxito:**
```json
{
  "success": true,
  "message": "Mensaje descriptivo",
  "data": {...}
}
```

**Error:**
```json
{
  "success": false,
  "message": "Mensaje de error",
  "errors": [...]
}
```

---

## Notas Importantes

1. **Autenticación**: Todas las rutas protegidas requieren el header `Authorization: Bearer {token}`
2. **Socket.io**: El token JWT debe enviarse en el handshake de autenticación
3. **Validaciones**: El servidor valida todas las jugadas en el backend
4. **Turnos**: Solo se pueden realizar acciones durante el turno del jugador
5. **Apuestas**: Las fichas se descuentan al iniciar la partida y se distribuyen al finalizar

---

## Ejemplos de Uso

### Flujo Completo de una Partida

```javascript
// 1. Login
const loginRes = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ email, password })
});
const { token } = await loginRes.json();

// 2. Conectar Socket.io
const socket = io('http://localhost:3000', {
  auth: { token }
});

// 3. Crear sala
const roomRes = await fetch('/api/rooms/create', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ bet: 100, maxPlayers: 4 })
});
const { room } = await roomRes.json();

// 4. Unirse a la sala
socket.emit('join_room', { roomId: room._id });

// 5. Marcar como listo
socket.emit('ready', { roomId: room._id, isReady: true });

// 6. Iniciar partida (solo host)
socket.emit('start_game', { roomId: room._id });

// 7. Recibir fichas
socket.on('tiles_dealt', (data) => {
  console.log('Mis fichas:', data.tiles);
});

// 8. Jugar fichas
socket.emit('play_tile', {
  roomId: room._id,
  tile: [6, 6],
  side: 'left'
});

// 9. Fin de partida
socket.on('game_ended', (data) => {
  console.log('Ganador:', data.winnerId);
});
```

---

## Soporte

Para reportar problemas o sugerir mejoras, por favor contacta al equipo de desarrollo.

