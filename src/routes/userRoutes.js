const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { validateUpdateProfile, validateMongoId, handleValidationErrors } = require('../middleware/validation');

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Obtener usuario por ID
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Usuario encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       404:
 *         description: Usuario no encontrado
 */
router.get('/:id', protect, validateMongoId('id'), handleValidationErrors, userController.getUserById);

/**
 * @swagger
 * /api/users/profile/update:
 *   patch:
 *     summary: Actualizar perfil del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Nuevo Nombre
 *               avatar:
 *                 type: string
 *                 example: avatar2.png
 *               country:
 *                 type: string
 *                 example: Argentina
 *     responses:
 *       200:
 *         description: Perfil actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Perfil actualizado exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/User'
 */
router.patch('/profile/update', protect, validateUpdateProfile, handleValidationErrors, userController.updateProfile);

/**
 * @swagger
 * /api/users/daily-bonus:
 *   post:
 *     summary: Reclamar bonus diario (100 fichas)
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Bonus reclamado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Bonus diario reclamado
 *                 data:
 *                   type: object
 *                   properties:
 *                     bonusAmount:
 *                       type: integer
 *                       example: 100
 *                     newBalance:
 *                       type: integer
 *                       example: 1100
 *       400:
 *         description: Ya reclamaste tu bonus diario
 */
router.post('/daily-bonus', protect, userController.claimDailyBonus);

/**
 * @swagger
 * /api/users/betting/stats:
 *   get:
 *     summary: Obtener estadísticas de apuestas del usuario
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas obtenidas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalWon:
 *                       type: integer
 *                       example: 5000
 *                     totalLost:
 *                       type: integer
 *                       example: 2000
 *                     totalBonuses:
 *                       type: integer
 *                       example: 500
 *                     recentTransactions:
 *                       type: array
 *                       items:
 *                         type: object
 */
router.get('/betting/stats', protect, userController.getBettingStats);

/**
 * @swagger
 * /api/users/leaderboard/top:
 *   get:
 *     summary: Obtener ranking de jugadores
 *     tags: [Usuarios]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Número de resultados
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [wins, coins, games]
 *           default: wins
 *         description: Criterio de ordenamiento
 *     responses:
 *       200:
 *         description: Ranking obtenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 */
router.get('/leaderboard/top', protect, userController.getLeaderboard);

module.exports = router;

