const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const {
  JWT_TOKEN_NAME,
  JWT_REFRESH_TOKEN_NAME,
  CSRF_HEADER_NAME,
  CSRF_TOKEN_NAME,
} = require('./utils/constants');
const backendErrorsMap = require('./utils/errorNames');

const Grid = {
  type: 'object',
  properties: {
    id: { type: 'string', example: '1' },
    name: { type: 'string', example: 'My Grid' },
    cells: {
      type: 'array',
      items: {
        type: 'array',
        items: { type: 'string', example: 'A' },
      },
      example: [
        ['A', 'B'],
        ['C', 'D'],
      ],
    },
    createdAt: { type: 'string', format: 'date-time' },
  },
};

const Message = {
  type: 'object',
  properties: {
    id: {
      type: 'integer',
      example: 1,
    },
    firstName: {
      type: 'string',
      example: 'Alice',
    },
    lastName: {
      type: 'string',
      example: 'Johnson',
    },
    email: {
      type: 'string',
      example: 'alice.johnson@example.com',
    },
    message: {
      type: 'string',
      example: 'This is a sample message.',
    },
  },
};

const Pagination = {
  type: 'object',
  properties: {
    total: {
      type: 'integer',
      example: 50,
    },
    page: {
      type: 'integer',
      example: 1,
    },
    limit: {
      type: 'integer',
      example: 10,
    },
    totalPages: {
      type: 'integer',
      example: 5,
    },
  },
};

const User = {
  type: 'object',
  required: ['firstName', 'lastName', 'email', 'role', 'id'],
  properties: {
    id: { type: 'integer', example: 1 },
    firstName: { type: 'string', example: 'Alice' },
    lastName: { type: 'string', example: 'John' },
    role: { type: 'string', example: 'admin' },
    email: { type: 'string', example: 'alice@example.com' },
  },
};

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '1.0.0',
      description: 'An enhanced Express API with JWT auth, schemas, and tags',
    },
    servers: [
      {
        url: process.env.SWAGGER_BASE_URL || 'http://localhost:5000',
      },
    ],
    tags: [
      {
        name: 'Users',
        description: 'Operations related to users',
      },
      {
        name: 'Auth',
        description: 'Authentication endpoints',
      },
      {
        name: 'Messages',
        description: 'Messages endpoints',
      },
      {
        name: 'Grid',
        description: 'Grid endpoints',
      },
    ],
    components: {
      parameters: {
        csrfToken: {
          in: 'header',
          name: CSRF_HEADER_NAME,
          required: true,
          schema: {
            type: 'string',
          },
          description: `CSRF token matching the ${CSRF_TOKEN_NAME} cookie value`,
        },
      },
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: JWT_TOKEN_NAME,
          description: 'JWT token stored in a secure HTTPOnly cookie',
        },
        refreshTokenCookie: {
          type: 'apiKey',
          in: 'cookie',
          name: JWT_REFRESH_TOKEN_NAME,
          description: 'JWT refresh token stored in a Secure HttpOnly cookie',
        },
      },
      schemas: {
        Grid,
        Message,
        User,
        Register: {
          type: 'object',
          required: ['firstName', 'lastName', 'email', 'password'],
          properties: {
            firstName: { type: 'string', example: 'Alice' },
            lastName: { type: 'string', example: 'John' },
            email: { type: 'string', example: 'alice@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },

        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              enum: Object.values(backendErrorsMap),
            },
            status: { type: 'integer', example: 401 },
          },
        },
        CSRFResponse: {
          type: 'object',
          properties: {
            csrfToken: { type: 'string', example: 'CSRF-token-value-here' },
          },
        },
      },
      responses: {
        MessagesResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: Message,
            },
            pagination: Pagination,
          },
        },
        UsersResponse: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: User,
            },
            pagination: Pagination,
          },
        },
        InternalServerError: {
          description: 'Internal server error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: 'INTERNAL_SERVER_ERROR',
                code: 500,
              },
            },
          },
        },
        UnauthenticatedResponse: {
          description: 'Unauthenticated, token invalid or missing',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error',
              },
              example: {
                message: backendErrorsMap.UNAUTHENTICATED,
                code: 401,
              },
            },
          },
        },
      },
    },
  },
  apis: ['./routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
