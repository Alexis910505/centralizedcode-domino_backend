const RoomManager = require('../services/roomManager/RoomManager');
const BetManager = require('../services/betSystem/BetManager');

// Obtener salas disponibles
exports.getRooms = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await RoomManager.getAvailableRooms(parseInt(page), parseInt(limit));

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

// Crear sala
exports.createRoom = async (req, res, next) => {
  try {
    const { bet, maxPlayers, isPrivate, name } = req.body;

    // Validar apuesta
    const validation = BetManager.validateBet(bet, req.user.coins);
    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.message
      });
    }

    const room = await RoomManager.createRoom(req.user._id, {
      bet,
      maxPlayers,
      isPrivate,
      name
    });

    res.status(201).json({
      success: true,
      message: 'Sala creada exitosamente',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Obtener sala por ID
exports.getRoomById = async (req, res, next) => {
  try {
    const room = await RoomManager.getRoomByCode(req.params.code);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Sala no encontrada'
      });
    }

    res.json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Unirse a sala
exports.joinRoom = async (req, res, next) => {
  try {
    const room = await RoomManager.joinRoom(req.user._id, req.params.id, null);

    res.json({
      success: true,
      message: 'Te has unido a la sala',
      data: room
    });
  } catch (error) {
    next(error);
  }
};

// Salir de sala
exports.leaveRoom = async (req, res, next) => {
  try {
    const result = await RoomManager.leaveRoom(req.user._id, req.params.id);

    res.json({
      success: true,
      message: 'Has salido de la sala',
      data: result
    });
  } catch (error) {
    next(error);
  }
};

