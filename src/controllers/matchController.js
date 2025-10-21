const Match = require('../models/Match');

// Obtener historial de partidas de un usuario
exports.getUserMatchHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const matches = await Match.find({
      'players.userId': userId
    })
      .populate('players.userId', 'name avatar')
      .populate('winner', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Match.countDocuments({
      'players.userId': userId
    });

    res.json({
      success: true,
      data: {
        matches,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

// Obtener detalle de una partida
exports.getMatchById = async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('players.userId', 'name avatar country')
      .populate('winner', 'name avatar');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada'
      });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    next(error);
  }
};

// Obtener estadísticas generales
exports.getStats = async (req, res, next) => {
  try {
    const totalMatches = await Match.countDocuments();
    const recentMatches = await Match.find()
      .populate('players.userId', 'name avatar')
      .populate('winner', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(10);

    // Calcular estadísticas adicionales
    const stats = await Match.aggregate([
      {
        $group: {
          _id: null,
          totalPot: { $sum: '$totalPot' },
          avgDuration: { $avg: '$duration' },
          avgPlayersPerMatch: { $avg: { $size: '$players' } }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        totalMatches,
        recentMatches,
        statistics: stats[0] || {}
      }
    });
  } catch (error) {
    next(error);
  }
};

