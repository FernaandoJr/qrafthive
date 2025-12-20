import { Elysia } from 'elysia';

export const healthRoutes = new Elysia({ prefix: '/health' }).get('/', () => ({
  success: true,
  data: {
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  },
}));
