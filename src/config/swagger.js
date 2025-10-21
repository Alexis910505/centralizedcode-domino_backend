const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Dominó Multijugador',
      version: '1.0.0',
      description: 'API REST completa para juego de dominó multijugador con apuestas virtuales y comunicación en tiempo real',
      contact: {
        name: 'Equipo de Desarrollo',
        email: 'soporte@domino.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desarrollo'
      },
      {
        url: 'https://api.domino.com',
        description: 'Servidor de Producción'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT obtenido del login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '64abc123def456789'
            },
            name: {
              type: 'string',
              example: 'Juan Pérez'
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'juan@example.com'
            },
            avatar: {
              type: 'string',
              example: 'avatar1.png'
            },
            country: {
              type: 'string',
              example: 'México'
            },
            coins: {
              type: 'integer',
              example: 1000
            },
            stats: {
              type: 'object',
              properties: {
                wins: { type: 'integer', example: 10 },
                losses: { type: 'integer', example: 5 },
                draws: { type: 'integer', example: 2 },
                totalGames: { type: 'integer', example: 17 },
                totalCoinsWon: { type: 'integer', example: 5000 },
                totalCoinsLost: { type: 'integer', example: 2000 }
              }
            },
            isOnline: {
              type: 'boolean',
              example: true
            }
          }
        },
        Room: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64abc123def456789'
            },
            roomCode: {
              type: 'string',
              example: 'ABC123'
            },
            name: {
              type: 'string',
              example: 'Sala VIP'
            },
            host: {
              type: 'string',
              example: '64abc123def456789'
            },
            players: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  position: { type: 'integer' },
                  isReady: { type: 'boolean' }
                }
              }
            },
            maxPlayers: {
              type: 'integer',
              example: 4
            },
            bet: {
              type: 'integer',
              example: 100
            },
            status: {
              type: 'string',
              enum: ['waiting', 'playing', 'finished'],
              example: 'waiting'
            },
            isPrivate: {
              type: 'boolean',
              example: false
            }
          }
        },
        Match: {
          type: 'object',
          properties: {
            _id: {
              type: 'string',
              example: '64abc123def456789'
            },
            roomId: {
              type: 'string',
              example: '64abc123def456789'
            },
            players: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  userId: { type: 'string' },
                  position: { type: 'integer' },
                  finalScore: { type: 'integer' },
                  coinsWon: { type: 'integer' },
                  coinsLost: { type: 'integer' }
                }
              }
            },
            winner: {
              type: 'string',
              example: '64abc123def456789'
            },
            winType: {
              type: 'string',
              enum: ['domino', 'blocked', 'points'],
              example: 'domino'
            },
            bet: {
              type: 'integer',
              example: 100
            },
            totalPot: {
              type: 'integer',
              example: 400
            },
            duration: {
              type: 'integer',
              description: 'Duración en segundos',
              example: 320
            },
            startedAt: {
              type: 'string',
              format: 'date-time'
            },
            finishedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              example: 'Mensaje de error'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object'
              }
            }
          }
        },
        Success: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            message: {
              type: 'string',
              example: 'Operación exitosa'
            },
            data: {
              type: 'object'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Autenticación',
        description: 'Endpoints de registro, login y gestión de sesión'
      },
      {
        name: 'Usuarios',
        description: 'Gestión de perfiles, estadísticas y ranking'
      },
      {
        name: 'Salas',
        description: 'Crear, unirse y gestionar salas de juego'
      },
      {
        name: 'Partidas',
        description: 'Historial y estadísticas de partidas'
      }
    ]
  },
  apis: ['./src/routes/*.js', './src/controllers/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

