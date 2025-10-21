const User = require('../../models/User');
const Transaction = require('../../models/Transaction');
const { TRANSACTION_TYPES, MIN_BET, MAX_BET } = require('../../config/constants');

class BetManager {
  // Validar apuesta
  validateBet(bet, userCoins) {
    if (bet < MIN_BET) {
      return { valid: false, message: `La apuesta mínima es ${MIN_BET} fichas` };
    }

    if (bet > MAX_BET) {
      return { valid: false, message: `La apuesta máxima es ${MAX_BET} fichas` };
    }

    if (userCoins < bet) {
      return { valid: false, message: 'No tienes suficientes fichas' };
    }

    return { valid: true };
  }

  // Descontar apuesta de los jugadores
  async deductBets(players, bet) {
    const results = [];

    for (const player of players) {
      const user = await User.findById(player.userId);
      
      if (!user) {
        throw new Error(`Usuario ${player.userId} no encontrado`);
      }

      if (user.coins < bet) {
        throw new Error(`${user.name} no tiene suficientes fichas`);
      }

      const balanceBefore = user.coins;
      user.coins -= bet;
      await user.save();

      // Registrar transacción
      await Transaction.create({
        userId: user._id,
        type: TRANSACTION_TYPES.LOSS,
        amount: -bet,
        balanceBefore,
        balanceAfter: user.coins,
        description: 'Apuesta en partida'
      });

      results.push({
        userId: user._id,
        coinsDeducted: bet,
        newBalance: user.coins
      });
    }

    return results;
  }

  // Distribuir ganancias al ganador
  async distributeWinnings(winnerId, losers, bet, matchId) {
    const totalPot = bet * (losers.length + 1); // Incluye la apuesta del ganador

    const winner = await User.findById(winnerId);
    if (!winner) {
      throw new Error('Ganador no encontrado');
    }

    const balanceBefore = winner.coins;
    winner.coins += totalPot;
    winner.stats.wins += 1;
    winner.stats.totalGames += 1;
    winner.stats.totalCoinsWon += totalPot;
    await winner.save();

    // Registrar transacción del ganador
    await Transaction.create({
      userId: winner._id,
      type: TRANSACTION_TYPES.WIN,
      amount: totalPot,
      balanceBefore,
      balanceAfter: winner.coins,
      matchId,
      description: `Ganancia por victoria (${losers.length + 1} jugadores)`
    });

    // Actualizar estadísticas de perdedores
    for (const loserId of losers) {
      const loser = await User.findById(loserId);
      if (loser) {
        loser.stats.losses += 1;
        loser.stats.totalGames += 1;
        loser.stats.totalCoinsLost += bet;
        await loser.save();
      }
    }

    return {
      winnerId,
      totalPot,
      winnerNewBalance: winner.coins
    };
  }

  // Distribuir en caso de empate
  async distributeDrawWinnings(playerIds, bet, matchId) {
    const totalPot = bet * playerIds.length;
    const sharePerPlayer = Math.floor(totalPot / playerIds.length);

    const results = [];

    for (const playerId of playerIds) {
      const user = await User.findById(playerId);
      if (!user) continue;

      const balanceBefore = user.coins;
      user.coins += sharePerPlayer;
      user.stats.draws += 1;
      user.stats.totalGames += 1;
      await user.save();

      // Registrar transacción
      await Transaction.create({
        userId: user._id,
        type: TRANSACTION_TYPES.WIN,
        amount: sharePerPlayer,
        balanceBefore,
        balanceAfter: user.coins,
        matchId,
        description: 'Empate - devolución de apuesta'
      });

      results.push({
        userId: user._id,
        coinsReceived: sharePerPlayer,
        newBalance: user.coins
      });
    }

    return results;
  }

  // Devolver apuestas (si la partida se cancela)
  async refundBets(players, bet, reason = 'Partida cancelada') {
    const results = [];

    for (const player of players) {
      const user = await User.findById(player.userId);
      if (!user) continue;

      const balanceBefore = user.coins;
      user.coins += bet;
      await user.save();

      // Registrar transacción
      await Transaction.create({
        userId: user._id,
        type: TRANSACTION_TYPES.REWARD,
        amount: bet,
        balanceBefore,
        balanceAfter: user.coins,
        description: `Devolución: ${reason}`
      });

      results.push({
        userId: user._id,
        coinsRefunded: bet,
        newBalance: user.coins
      });
    }

    return results;
  }

  // Otorgar bonus diario
  async grantDailyBonus(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    if (!user.canClaimDailyBonus()) {
      throw new Error('Ya reclamaste tu bonus diario');
    }

    const bonusAmount = parseInt(process.env.DAILY_BONUS) || 100;
    const balanceBefore = user.coins;
    
    user.coins += bonusAmount;
    user.lastDailyBonus = new Date();
    await user.save();

    // Registrar transacción
    await Transaction.create({
      userId: user._id,
      type: TRANSACTION_TYPES.DAILY_BONUS,
      amount: bonusAmount,
      balanceBefore,
      balanceAfter: user.coins,
      description: 'Bonus diario'
    });

    return {
      success: true,
      bonusAmount,
      newBalance: user.coins
    };
  }

  // Calcular estadísticas de apuestas
  async getBettingStats(userId) {
    const transactions = await Transaction.find({ userId })
      .sort({ createdAt: -1 })
      .limit(100);

    const stats = {
      totalWon: 0,
      totalLost: 0,
      totalBonuses: 0,
      recentTransactions: transactions.slice(0, 10)
    };

    transactions.forEach(t => {
      if (t.type === TRANSACTION_TYPES.WIN) {
        stats.totalWon += t.amount;
      } else if (t.type === TRANSACTION_TYPES.LOSS) {
        stats.totalLost += Math.abs(t.amount);
      } else if (t.type === TRANSACTION_TYPES.DAILY_BONUS) {
        stats.totalBonuses += t.amount;
      }
    });

    return stats;
  }
}

module.exports = new BetManager();

