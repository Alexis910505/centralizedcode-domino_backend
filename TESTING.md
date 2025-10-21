# 🧪 Guía de Pruebas - Backend Dominó

## Pruebas Manuales con Thunder Client / Postman

### 1. Autenticación

#### Registro de Usuario
```
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "avatar": "avatar1.png",
  "country": "México"
}
```

#### Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "password123"
}
```

Guarda el `token` de la respuesta para las siguientes peticiones.

---

### 2. Usuarios

#### Obtener Perfil
```
GET http://localhost:3000/api/auth/profile
Authorization: Bearer {tu_token}
```

#### Actualizar Perfil
```
PATCH http://localhost:3000/api/users/profile/update
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "name": "Nuevo Nombre",
  "avatar": "avatar2.png"
}
```

#### Reclamar Bonus Diario
```
POST http://localhost:3000/api/users/daily-bonus
Authorization: Bearer {tu_token}
```

#### Ver Ranking
```
GET http://localhost:3000/api/users/leaderboard/top?limit=10&sortBy=wins
Authorization: Bearer {tu_token}
```

---

### 3. Salas

#### Crear Sala
```
POST http://localhost:3000/api/rooms/create
Authorization: Bearer {tu_token}
Content-Type: application/json

{
  "bet": 100,
  "maxPlayers": 4,
  "isPrivate": false,
  "name": "Sala de Prueba"
}
```

#### Listar Salas
```
GET http://localhost:3000/api/rooms?page=1&limit=20
Authorization: Bearer {tu_token}
```

#### Unirse a Sala
```
POST http://localhost:3000/api/rooms/{room_id}/join
Authorization: Bearer {tu_token}
```

#### Salir de Sala
```
POST http://localhost:3000/api/rooms/{room_id}/leave
Authorization: Bearer {tu_token}
```

---

### 4. Partidas

#### Ver Historial
```
GET http://localhost:3000/api/matches/history/{user_id}?page=1&limit=10
Authorization: Bearer {tu_token}
```

#### Ver Detalle de Partida
```
GET http://localhost:3000/api/matches/{match_id}
Authorization: Bearer {tu_token}
```

---

## Pruebas con Socket.io

### Cliente de Prueba en JavaScript

```javascript
// Instalar: npm install socket.io-client
const io = require('socket.io-client');

// Conectar
const socket = io('http://localhost:3000', {
  auth: {
    token: 'tu_token_jwt'
  }
});

// Eventos
socket.on('connected', (data) => {
  console.log('✅ Conectado:', data);
});

socket.on('error', (data) => {
  console.error('❌ Error:', data.message);
});

// Unirse a sala
socket.emit('join_room', { roomId: 'id_de_sala' });

socket.on('room_joined', (data) => {
  console.log('✅ Te uniste a la sala');
});

// Marcar como listo
socket.emit('ready', { roomId: 'id_de_sala', isReady: true });

// Iniciar partida (solo host)
socket.emit('start_game', { roomId: 'id_de_sala' });

socket.on('game_started', (data) => {
  console.log('🎮 Partida iniciada');
  console.log('Turno actual:', data.currentTurn);
});

socket.on('tiles_dealt', (data) => {
  console.log('🎲 Tus fichas:', data.tiles);
  console.log('¿Tu turno?:', data.isYourTurn);
});

// Jugar ficha
socket.emit('play_tile', {
  roomId: 'id_de_sala',
  tile: [6, 5],
  side: 'left'
});

socket.on('tile_played', (data) => {
  console.log('✅ Ficha jugada por:', data.playerName);
  console.log('Tablero:', data.board);
});

// Pasar turno
socket.emit('pass_turn', { roomId: 'id_de_sala' });

socket.on('turn_passed', (data) => {
  console.log('⏭️ Turno pasado por:', data.playerName);
});

// Fin de partida
socket.on('game_ended', (data) => {
  console.log('🏆 Partida terminada');
  console.log('Ganador:', data.winnerId);
  console.log('Bote:', data.totalPot);
});
```

---

## Flujo de Prueba Completo

### Escenario: Partida de 2 Jugadores

**Preparación:**
1. Registrar 2 usuarios
2. Obtener tokens de ambos
3. Conectar ambos clientes Socket.io

**Pasos:**

1. **Jugador 1: Crear sala**
```javascript
// HTTP
POST /api/rooms/create
{ bet: 100, maxPlayers: 2 }

// Guardar roomId de la respuesta
```

2. **Jugador 1: Unirse a su propia sala**
```javascript
socket1.emit('join_room', { roomId });
```

3. **Jugador 2: Unirse a la sala**
```javascript
socket2.emit('join_room', { roomId });
```

4. **Ambos jugadores: Marcar como listos**
```javascript
socket1.emit('ready', { roomId, isReady: true });
socket2.emit('ready', { roomId, isReady: true });
```

5. **Jugador 1 (host): Iniciar partida**
```javascript
socket1.emit('start_game', { roomId });
```

6. **Ambos jugadores: Recibir fichas**
```javascript
socket1.on('tiles_dealt', (data) => {
  console.log('Jugador 1 fichas:', data.tiles);
});

socket2.on('tiles_dealt', (data) => {
  console.log('Jugador 2 fichas:', data.tiles);
});
```

7. **Jugador en turno: Jugar ficha**
```javascript
socket1.emit('play_tile', {
  roomId,
  tile: [6, 6], // Usar una de tus fichas
  side: 'left'
});
```

8. **Continuar hasta que alguien gane**

9. **Verificar distribución de fichas**
```javascript
// HTTP
GET /api/auth/profile
// Verificar que coins se hayan actualizado
```

---

## Casos de Prueba

### ✅ Casos Exitosos

1. **Registro exitoso**
   - Usuario nuevo
   - Datos válidos
   - Resultado: 201, token JWT

2. **Login exitoso**
   - Usuario existente
   - Credenciales correctas
   - Resultado: 200, token JWT

3. **Crear sala exitosa**
   - Usuario con fichas suficientes
   - Apuesta válida
   - Resultado: 201, sala creada

4. **Unirse a sala**
   - Sala existe y no está llena
   - Usuario con fichas suficientes
   - Resultado: Usuario agregado

5. **Jugar ficha válida**
   - Es el turno del jugador
   - Ficha existe en mano
   - Ficha encaja en tablero
   - Resultado: Ficha jugada

### ❌ Casos de Error

1. **Registro con email duplicado**
   - Resultado: 400, "El email ya está registrado"

2. **Login con credenciales incorrectas**
   - Resultado: 401, "Credenciales inválidas"

3. **Crear sala sin fichas suficientes**
   - Resultado: 400, "No tienes suficientes fichas"

4. **Unirse a sala llena**
   - Resultado: 400, "La sala está llena"

5. **Jugar ficha fuera de turno**
   - Resultado: Error, "No es tu turno"

6. **Jugar ficha inválida**
   - Resultado: Error, "Jugada inválida"

7. **Pasar turno pudiendo jugar**
   - Resultado: Error, "Tienes jugadas disponibles"

---

## Validaciones del Motor de Juego

### Validar repartir fichas
- Cada jugador recibe 7 fichas
- No hay fichas duplicadas
- Total de fichas = 28

### Validar jugadas
- Primera ficha: cualquier orientación
- Siguientes: deben coincidir con extremos
- Fichas se remueven de la mano

### Validar tranca
- Nadie puede jugar
- Gana quien tenga menos puntos

### Validar ganador
- Alguien se queda sin fichas
- Recibe todo el bote

---

## Herramientas Recomendadas

- **Thunder Client** (VS Code extension)
- **Postman** (Desktop app)
- **Socket.io Client Tool** (npm package)
- **MongoDB Compass** (para ver la BD)

---

## Comandos Útiles

```bash
# Ver logs del servidor
npm run dev

# Limpiar y reiniciar BD
node scripts/seed.js

# Limpiar salas abandonadas
node scripts/cleanup.js
```

---

## Checklist de Pruebas

- [ ] Registro de usuario
- [ ] Login de usuario
- [ ] Actualizar perfil
- [ ] Reclamar bonus diario
- [ ] Crear sala
- [ ] Listar salas
- [ ] Unirse a sala
- [ ] Salir de sala
- [ ] Marcar como listo
- [ ] Iniciar partida
- [ ] Repartir fichas correctamente
- [ ] Jugar fichas válidas
- [ ] Rechazar fichas inválidas
- [ ] Pasar turno
- [ ] Detectar tranca
- [ ] Detectar ganador
- [ ] Distribuir ganancias
- [ ] Ver historial
- [ ] Desconexión de jugador

