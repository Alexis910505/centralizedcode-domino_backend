const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Registro de usuario
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, avatar, country } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      });
    }

    // Crear usuario
    const user = await User.create({
      name,
      email,
      password,
      avatar: avatar || 'avatar1.png',
      country: country || 'Unknown'
    });

    // Generar token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Login de usuario
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario con contraseña
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Actualizar estado online
    user.isOnline = true;
    await user.save();

    // Generar token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login exitoso',
      data: {
        user: user.getPublicProfile(),
        token
      }
    });
  } catch (error) {
    next(error);
  }
};

// Logout
exports.logout = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isOnline = false;
      await user.save();
    }

    res.json({
      success: true,
      message: 'Logout exitoso'
    });
  } catch (error) {
    next(error);
  }
};

// Obtener perfil actual
exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    
    res.json({
      success: true,
      data: user.getPublicProfile()
    });
  } catch (error) {
    next(error);
  }
};

