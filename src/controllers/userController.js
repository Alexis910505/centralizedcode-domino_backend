const User = require('../models/User');
const BetManager = require('../services/betSystem/BetManager');

// Obtener usuario por ID
exports.getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar perfil
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar, country } = req.body;
    
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;
    if (country) user.country = country;

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

// Reclamar bonus diario
exports.claimDailyBonus = async (req, res, next) => {
  try {
    const result = await BetManager.grantDailyBonus(req.user._id);

    res.json({
      success: true,
      message: 'Bonus diario reclamado',
      data: result
    });
  } catch (error) {
    if (error.message === 'Ya reclamaste tu bonus diario') {
      return res.status(400).json({
        success: false,
        message: error.message
      });
    }
    next(error);
  }
};

// Obtener estadísticas de apuestas
exports.getBettingStats = async (req, res, next) => {
  try {
    const stats = await BetManager.getBettingStats(req.user._id);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
};

// Obtener ranking de jugadores
exports.getLeaderboard = async (req, res, next) => {
  try {
    const { limit = 50, sortBy = 'wins' } = req.query;

    let sortField = 'stats.wins';
    if (sortBy === 'coins') sortField = 'coins';
    if (sortBy === 'games') sortField = 'stats.totalGames';

    const users = await User.find()
      .select('name avatar country coins stats')
      .sort({ [sortField]: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

