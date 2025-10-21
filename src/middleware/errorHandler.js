// Middleware para manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  let error = { ...err };
  error.message = err.message;

  // Error de Mongoose - CastError
  if (err.name === 'CastError') {
    const message = 'Recurso no encontrado';
    error.statusCode = 404;
    error.message = message;
  }

  // Error de Mongoose - Duplicado
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `${field} ya existe`;
    error.statusCode = 400;
    error.message = message;
  }

  // Error de Mongoose - Validación
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error.statusCode = 400;
    error.message = message;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

module.exports = errorHandler;

