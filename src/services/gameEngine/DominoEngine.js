const { TILES_PER_PLAYER, MAX_TILE_VALUE } = require('../../config/constants');

class DominoEngine {
  constructor() {
    this.allTiles = this.generateAllTiles();
  }

  // Generar todas las fichas del dominó (0|0 hasta 6|6)
  generateAllTiles() {
    const tiles = [];
    for (let i = 0; i <= MAX_TILE_VALUE; i++) {
      for (let j = i; j <= MAX_TILE_VALUE; j++) {
        tiles.push([i, j]);
      }
    }
    return tiles;
  }

  // Barajar fichas
  shuffleTiles(tiles) {
    const shuffled = [...tiles];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Repartir fichas a los jugadores
  dealTiles(numPlayers) {
    const shuffled = this.shuffleTiles(this.allTiles);
    const hands = [];
    
    for (let i = 0; i < numPlayers; i++) {
      const start = i * TILES_PER_PLAYER;
      const end = start + TILES_PER_PLAYER;
      hands.push(shuffled.slice(start, end));
    }

    // Las fichas restantes van al pozo (boneyard)
    const boneyard = shuffled.slice(numPlayers * TILES_PER_PLAYER);

    return { hands, boneyard };
  }

  // Determinar quién empieza (quien tenga el doble más alto)
  determineFirstPlayer(hands) {
    let highestDouble = -1;
    let firstPlayerIndex = 0;

    hands.forEach((hand, index) => {
      hand.forEach(tile => {
        if (tile[0] === tile[1] && tile[0] > highestDouble) {
          highestDouble = tile[0];
          firstPlayerIndex = index;
        }
      });
    });

    // Si nadie tiene doble, empieza el que tenga la ficha con mayor suma
    if (highestDouble === -1) {
      let maxSum = -1;
      hands.forEach((hand, index) => {
        hand.forEach(tile => {
          const sum = tile[0] + tile[1];
          if (sum > maxSum) {
            maxSum = sum;
            firstPlayerIndex = index;
          }
        });
      });
    }

    return firstPlayerIndex;
  }

  // Validar si una ficha puede jugarse en el tablero
  canPlayTile(tile, board, side) {
    if (board.length === 0) {
      return true; // Primera jugada
    }

    const leftEnd = board[0].tile[0];
    const rightEnd = board[board.length - 1].tile[1];

    if (side === 'left') {
      return tile[0] === leftEnd || tile[1] === leftEnd;
    } else if (side === 'right') {
      return tile[0] === rightEnd || tile[1] === rightEnd;
    }

    return false;
  }

  // Obtener la orientación correcta de la ficha
  getCorrectOrientation(tile, board, side) {
    if (board.length === 0) {
      return tile; // Primera jugada, cualquier orientación
    }

    const leftEnd = board[0].tile[0];
    const rightEnd = board[board.length - 1].tile[1];

    if (side === 'left') {
      // La ficha debe coincidir con el extremo izquierdo
      if (tile[1] === leftEnd) {
        return tile; // Está bien orientada
      } else if (tile[0] === leftEnd) {
        return [tile[1], tile[0]]; // Voltear
      }
    } else if (side === 'right') {
      // La ficha debe coincidir con el extremo derecho
      if (tile[0] === rightEnd) {
        return tile; // Está bien orientada
      } else if (tile[1] === rightEnd) {
        return [tile[1], tile[0]]; // Voltear
      }
    }

    return tile;
  }

  // Verificar si un jugador puede jugar
  playerCanPlay(hand, board) {
    if (board.length === 0) {
      return true; // Primera jugada
    }

    const leftEnd = board[0].tile[0];
    const rightEnd = board[board.length - 1].tile[1];

    return hand.some(tile => 
      tile[0] === leftEnd || tile[1] === leftEnd || 
      tile[0] === rightEnd || tile[1] === rightEnd
    );
  }

  // Verificar si el juego está trancado
  isGameBlocked(playerHands, board, passCount) {
    // Si todos pasaron en una ronda completa
    if (passCount >= playerHands.length) {
      return true;
    }

    // Verificar si ningún jugador puede jugar
    const anyoneCanPlay = playerHands.some(hand => 
      this.playerCanPlay(hand.tiles, board)
    );

    return !anyoneCanPlay;
  }

  // Calcular puntos de las fichas restantes de un jugador
  calculatePoints(hand) {
    return hand.reduce((sum, tile) => sum + tile[0] + tile[1], 0);
  }

  // Determinar ganador en caso de tranca
  determineWinnerOnBlock(playerHands) {
    let minPoints = Infinity;
    let winnerId = null;

    playerHands.forEach(player => {
      const points = this.calculatePoints(player.tiles);
      if (points < minPoints) {
        minPoints = points;
        winnerId = player.userId;
      }
    });

    return { winnerId, points: minPoints };
  }

  // Verificar si hay un ganador (alguien se quedó sin fichas)
  checkWinner(playerHands) {
    for (const player of playerHands) {
      if (player.tiles.length === 0) {
        return player.userId;
      }
    }
    return null;
  }

  // Remover ficha de la mano del jugador
  removeTileFromHand(hand, tile) {
    const index = hand.findIndex(t => 
      (t[0] === tile[0] && t[1] === tile[1]) || 
      (t[0] === tile[1] && t[1] === tile[0])
    );
    
    if (index !== -1) {
      hand.splice(index, 1);
      return true;
    }
    return false;
  }

  // Obtener todas las jugadas posibles para un jugador
  getPossibleMoves(hand, board) {
    if (board.length === 0) {
      return hand.map(tile => ({ tile, side: 'left' }));
    }

    const moves = [];
    const leftEnd = board[0].tile[0];
    const rightEnd = board[board.length - 1].tile[1];

    hand.forEach(tile => {
      if (tile[0] === leftEnd || tile[1] === leftEnd) {
        moves.push({ tile, side: 'left' });
      }
      if (tile[0] === rightEnd || tile[1] === rightEnd) {
        moves.push({ tile, side: 'right' });
      }
    });

    return moves;
  }

  // Validar que la ficha existe en la mano del jugador
  tileExistsInHand(tile, hand) {
    return hand.some(t => 
      (t[0] === tile[0] && t[1] === tile[1]) || 
      (t[0] === tile[1] && t[1] === tile[0])
    );
  }
}

module.exports = new DominoEngine();

