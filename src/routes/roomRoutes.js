const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { protect } = require('../middleware/auth');
const { validateCreateRoom, validateMongoId, handleValidationErrors } = require('../middleware/validation');

/**
 * @swagger
 * /api/rooms:
 *   get:
 *     summary: Listar salas disponibles
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
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
 *         description: Lista de salas obtenida
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
 *                     rooms:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Room'
 *                     total:
 *                       type: integer
 *                       example: 15
 *                     page:
 *                       type: integer
 *                       example: 1
 *                     pages:
 *                       type: integer
 *                       example: 1
 */
router.get('/', protect, roomController.getRooms);

/**
 * @swagger
 * /api/rooms/create:
 *   post:
 *     summary: Crear nueva sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bet
 *             properties:
 *               bet:
 *                 type: integer
 *                 minimum: 10
 *                 example: 100
 *                 description: Apuesta de la sala
 *               maxPlayers:
 *                 type: integer
 *                 minimum: 2
 *                 maximum: 4
 *                 default: 4
 *                 example: 4
 *                 description: Número máximo de jugadores
 *               isPrivate:
 *                 type: boolean
 *                 default: false
 *                 example: false
 *                 description: Si la sala es privada
 *               name:
 *                 type: string
 *                 example: Sala VIP
 *                 description: Nombre de la sala
 *     responses:
 *       201:
 *         description: Sala creada exitosamente
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
 *                   example: Sala creada exitosamente
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: Error de validación o fichas insuficientes
 */
router.post('/create', protect, validateCreateRoom, handleValidationErrors, roomController.createRoom);

/**
 * @swagger
 * /api/rooms/{code}:
 *   get:
 *     summary: Obtener sala por código
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: code
 *         required: true
 *         schema:
 *           type: string
 *         description: Código de la sala (ej. ABC123)
 *     responses:
 *       200:
 *         description: Sala encontrada
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       404:
 *         description: Sala no encontrada
 */
router.get('/:code', protect, roomController.getRoomById);

/**
 * @swagger
 * /api/rooms/{id}/join:
 *   post:
 *     summary: Unirse a una sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Unido a la sala exitosamente
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
 *                   example: Te has unido a la sala
 *                 data:
 *                   $ref: '#/components/schemas/Room'
 *       400:
 *         description: Sala llena, ya estás en una sala, o fichas insuficientes
 */
router.post('/:id/join', protect, validateMongoId('id'), handleValidationErrors, roomController.joinRoom);

/**
 * @swagger
 * /api/rooms/{id}/leave:
 *   post:
 *     summary: Salir de una sala
 *     tags: [Salas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID de la sala
 *     responses:
 *       200:
 *         description: Saliste de la sala exitosamente
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
 *                   example: Has salido de la sala
 *       400:
 *         description: No estás en esta sala
 */
router.post('/:id/leave', protect, validateMongoId('id'), handleValidationErrors, roomController.leaveRoom);

module.exports = router;

