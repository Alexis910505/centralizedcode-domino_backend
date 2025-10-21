const Room = require('../../models/Room');
const Match = require('../../models/Match');
const DominoEngine = require('../../services/gameEngine/DominoEngine');
const BetManager = require('../../services/betSystem/BetManager');
const { ROOM_STATUS, GAME_STATUS } = require('../../config/constants');

// Registrar eventos de juego
exports.registerGameEvents = (socket, io, connectedUsers) => {
  
  // Iniciar partida
  socket.on('start_game', async (data) => {
    try {
      const { roomId } = data;
      
      const room = await Room.findById(roomId).populate('players.userId', 'name avatar');
      
      if (!room) {
        return socket.emit('error', { message: 'Sala no encontrada' });
      }

      // Verificar que sea el host
      if (room.host.toString() !== socket.userId) {
        return socket.emit('error', { message: 'Solo el host puede iniciar la partida' });
      }

      // Verificar que todos estén listos
      if (room.players.length < 2) {
        return socket.emit('error', { message: 'Se necesitan al menos 2 jugadores' });
      }

      if (!room.players.every(p => p.isReady)) {
        return socket.emit('error', { message: 'No todos los jugadores están listos' });
      }

      // Descontar apuestas
      try {
        await BetManager.deductBets(room.players, room.bet);
      } catch (error) {
        return socket.emit('error', { message: error.message });
      }

      // Repartir fichas
      const { hands, boneyard } = DominoEngine.dealTiles(room.players.length);
      
      // Determinar quién empieza
      const firstPlayerIndex = DominoEngine.determineFirstPlayer(hands);
      const turnOrder = room.players.map(p => p.userId);
      
      // Inicializar estado del juego
      room.status = ROOM_STATUS.PLAYING;
      room.startedAt = new Date();
      room.gameState = {
        board: [],
        currentTurn: turnOrder[firstPlayerIndex],
        turnOrder,
        playerHands: room.players.map((p, index) => ({
          userId: p.userId,
          tiles: hands[index],
          tilesCount: hands[index].length
        })),
        boneyard,
        passCount: 0,
        movesLog: []
      };

      await room.save();

      // Notificar inicio de partida a todos
      io.to(roomId).emit('game_started', {
        message: 'La partida ha comenzado',
        currentTurn: room.gameState.currentTurn,
        firstPlayer: room.players[firstPlayerIndex].userId
      });

      // Enviar fichas a cada jugador (privado)
      room.players.forEach((player, index) => {
        const playerSocketId = connectedUsers.get(player.userId.toString());
        if (playerSocketId) {
          io.to(playerSocketId).emit('tiles_dealt', {
            tiles: hands[index],
            isYourTurn: player.userId.toString() === room.gameState.currentTurn.toString()
          });
        }
      });

    } catch (error) {
      console.error('Error al iniciar partida:', error);
      socket.emit('error', { message: 'Error al iniciar la partida' });
    }
  });

  // Jugar una ficha
  socket.on('play_tile', async (data) => {
    try {
      const { roomId, tile, side } = data;
      
      const room = await Room.findById(roomId).populate('players.userId', 'name avatar');
      
      if (!room) {
        return socket.emit('error', { message: 'Sala no encontrada' });
      }

      // Verificar que sea el turno del jugador
      if (room.gameState.currentTurn.toString() !== socket.userId) {
        return socket.emit('error', { message: 'No es tu turno' });
      }

      // Obtener la mano del jugador
      const playerHand = room.gameState.playerHands.find(
        h => h.userId.toString() === socket.userId
      );

      if (!playerHand) {
        return socket.emit('error', { message: 'Mano no encontrada' });
      }

      // Verificar que la ficha existe en la mano
      if (!DominoEngine.tileExistsInHand(tile, playerHand.tiles)) {
        return socket.emit('error', { message: 'No tienes esa ficha' });
      }

      // Validar que la ficha se puede jugar
      if (!DominoEngine.canPlayTile(tile, room.gameState.board, side)) {
        return socket.emit('error', { message: 'Jugada inválida' });
      }

      // Obtener orientación correcta
      const orientedTile = DominoEngine.getCorrectOrientation(tile, room.gameState.board, side);

      // Remover ficha de la mano
      DominoEngine.removeTileFromHand(playerHand.tiles, tile);
      playerHand.tilesCount = playerHand.tiles.length;

      // Agregar ficha al tablero
      if (side === 'left') {
        room.gameState.board.unshift({
          tile: orientedTile,
          playedBy: socket.userId
        });
      } else {
        room.gameState.board.push({
          tile: orientedTile,
          playedBy: socket.userId
        });
      }

      // Registrar movimiento
      room.gameState.movesLog.push({
        playerId: socket.userId,
        action: 'play',
        tile: orientedTile,
        side,
        timestamp: new Date()
      });

      // Resetear contador de pases
      room.gameState.passCount = 0;

      // Verificar si hay ganador
      const winnerId = DominoEngine.checkWinner(room.gameState.playerHands);
      
      if (winnerId) {
        // Hay ganador - finalizar partida
        await finalizeGame(room, winnerId, 'domino', io);
        return;
      }

      // Cambiar turno
      room.gameState.currentTurn = room.getNextPlayer();

      await room.save();

      // Notificar la jugada a todos
      io.to(roomId).emit('tile_played', {
        playerId: socket.userId,
        playerName: socket.userData.name,
        tile: orientedTile,
        side,
        board: room.gameState.board,
        currentTurn: room.gameState.currentTurn,
        playerTilesCount: room.gameState.playerHands.map(h => ({
          userId: h.userId,
          count: h.tilesCount
        }))
      });

    } catch (error) {
      console.error('Error al jugar ficha:', error);
      socket.emit('error', { message: 'Error al jugar la ficha' });
    }
  });

  // Pasar turno
  socket.on('pass_turn', async (data) => {
    try {
      const { roomId } = data;
      
      const room = await Room.findById(roomId).populate('players.userId', 'name avatar');
      
      if (!room) {
        return socket.emit('error', { message: 'Sala no encontrada' });
      }

      // Verificar que sea el turno del jugador
      if (room.gameState.currentTurn.toString() !== socket.userId) {
        return socket.emit('error', { message: 'No es tu turno' });
      }

      // Verificar que realmente no puede jugar
      const playerHand = room.gameState.playerHands.find(
        h => h.userId.toString() === socket.userId
      );

      if (DominoEngine.playerCanPlay(playerHand.tiles, room.gameState.board)) {
        return socket.emit('error', { message: 'Tienes jugadas disponibles' });
      }

      // Registrar pase
      room.gameState.movesLog.push({
        playerId: socket.userId,
        action: 'pass',
        timestamp: new Date()
      });

      room.gameState.passCount++;

      // Verificar si el juego está trancado
      if (DominoEngine.isGameBlocked(room.gameState.playerHands, room.gameState.board, room.gameState.passCount)) {
        // Juego trancado - determinar ganador por puntos
        const { winnerId } = DominoEngine.determineWinnerOnBlock(room.gameState.playerHands);
        await finalizeGame(room, winnerId, 'blocked', io);
        return;
      }

      // Cambiar turno
      room.gameState.currentTurn = room.getNextPlayer();

      await room.save();

      // Notificar el pase a todos
      io.to(roomId).emit('turn_passed', {
        playerId: socket.userId,
        playerName: socket.userData.name,
        currentTurn: room.gameState.currentTurn,
        passCount: room.gameState.passCount
      });

    } catch (error) {
      console.error('Error al pasar turno:', error);
      socket.emit('error', { message: 'Error al pasar turno' });
    }
  });
};

// Función para finalizar la partida
async function finalizeGame(room, winnerId, winType, io) {
  try {
    room.status = ROOM_STATUS.FINISHED;
    room.finishedAt = new Date();
    await room.save();

    const duration = Math.floor((room.finishedAt - room.startedAt) / 1000); // en segundos
    const totalPot = room.bet * room.players.length;

    // Crear registro de partida
    const match = await Match.create({
      roomId: room._id,
      players: room.players.map((p, index) => ({
        userId: p.userId,
        position: index,
        finalTiles: room.gameState.playerHands[index]?.tiles || [],
        finalScore: DominoEngine.calculatePoints(room.gameState.playerHands[index]?.tiles || []),
        coinsWon: p.userId.toString() === winnerId.toString() ? totalPot : 0,
        coinsLost: p.userId.toString() !== winnerId.toString() ? room.bet : 0
      })),
      winner: winnerId,
      winType,
      bet: room.bet,
      totalPot,
      movesLog: room.gameState.movesLog,
      duration,
      startedAt: room.startedAt,
      finishedAt: room.finishedAt
    });

    // Distribuir ganancias
    const loserIds = room.players
      .filter(p => p.userId.toString() !== winnerId.toString())
      .map(p => p.userId);
    
    await BetManager.distributeWinnings(winnerId, loserIds, room.bet, match._id);

    // Notificar fin de partida
    io.to(room._id.toString()).emit('game_ended', {
      winnerId,
      winType,
      totalPot,
      finalScores: room.gameState.playerHands.map(h => ({
        userId: h.userId,
        tiles: h.tiles,
        points: DominoEngine.calculatePoints(h.tiles)
      })),
      matchId: match._id
    });

  } catch (error) {
    console.error('Error al finalizar partida:', error);
  }
}

