import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { errorPlugin } from './plugins/error';
import { healthRoutes } from './routes/health';
import { qrcodeRoutes } from './routes/qrcode';

const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .use(errorPlugin)
  .group('/v1', (app) => app.use(healthRoutes).use(qrcodeRoutes))
  .listen(PORT);

console.log(`🌐 Qrafthive API is running at ${app.server?.hostname}:${app.server?.port}`);
