const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');
const { protect } = require('../middleware/auth');
const { validateMongoId, handleValidationErrors } = require('../middleware/validation');

/**
 * @swagger
 * /api/matches/history/{userId}:
 *   get:
 *     summary: Obtener historial de partidas de un usuario
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del usuario
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Resultados por página
 *     responses:
 *       200:
 *         description: Historial obtenido exitosamente
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
 *                     matches:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *                     total:
 *                       type: integer
 *                       example: 50
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 3
 */
router.get('/history/:userId', protect, validateMongoId('userId'), handleValidationErrors, matchController.getUserMatchHistory);

/**
 * @swagger
 * /api/matches/{id}:
 *   get:
 *     summary: Obtener detalle de una partida
 *     tags: [Partidas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la partida
 *     responses:
 *       200:
 *         description: Detalle de partida obtenido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Match'
 *       404:
 *         description: Partida no encontrada
 */
router.get('/:id', protect, validateMongoId('id'), handleValidationErrors, matchController.getMatchById);

/**
 * @swagger
 * /api/matches/stats/general:
 *   get:
 *     summary: Obtener estadísticas generales del juego
 *     tags: [Partidas]
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
 *                     totalMatches:
 *                       type: integer
 *                       example: 1000
 *                     recentMatches:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Match'
 *                     statistics:
 *                       type: object
 *                       properties:
 *                         totalPot:
 *                           type: integer
 *                           example: 150000
 *                         avgDuration:
 *                           type: number
 *                           example: 320.5
 *                         avgPlayersPerMatch:
 *                           type: number
 *                           example: 3.5
 */
router.get('/stats/general', protect, matchController.getStats);

module.exports = router;

