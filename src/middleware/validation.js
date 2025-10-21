const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
exports.handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validaciones para registro
exports.validateRegister = [
  body('name')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre debe tener entre 3 y 30 caracteres'),
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

// Validaciones para login
exports.validateLogin = [
  body('email')
    .trim()
    .isEmail()
    .normalizeEmail()
    .withMessage('Email inválido'),
  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];

// Validaciones para crear sala
exports.validateCreateRoom = [
  body('bet')
    .isInt({ min: 10 })
    .withMessage('La apuesta mínima es 10 fichas'),
  body('maxPlayers')
    .optional()
    .isInt({ min: 2, max: 4 })
    .withMessage('El número de jugadores debe ser entre 2 y 4'),
  body('isPrivate')
    .optional()
    .isBoolean()
    .withMessage('isPrivate debe ser un booleano'),
];

// Validaciones para actualizar perfil
exports.validateUpdateProfile = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('El nombre debe tener entre 3 y 30 caracteres'),
  body('avatar')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Avatar inválido'),
  body('country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('País inválido'),
];

// Validación de ID de Mongoose
exports.validateMongoId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage('ID inválido'),
];

