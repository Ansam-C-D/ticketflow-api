import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { prisma } from './db/prisma.ts';
import {
  errorHandler,
  notFoundHandler
} from './middleware/error.middleware.ts';
import { authRoutes } from './modules/auth/auth.routes.ts';
import { userRoutes } from './modules/users/user.routes.ts';
import { ticketRoutes } from './modules/tickets/ticket.routes.ts';
import { ticketRoutes as comment } from './modules/comments/comments.routes.ts';
import { ticketRoutes as history } from './modules/history/history.routes.ts';
const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Ticketflow API',
      version: '1.0.0'
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['src/modules/**/*.ts']
});

export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.get('/health', async (_request, response, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    response.json({
      status: 'ok',
      database: 'connected'
    });
  } catch (error) {
    next(error);
  }
});

app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/tickets', comment);
app.use('/api/tickets', history);

app.use(notFoundHandler);
app.use(errorHandler);
