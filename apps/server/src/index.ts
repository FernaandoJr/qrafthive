import { cors } from '@elysiajs/cors';
import { Elysia } from 'elysia';
import { errorPlugin } from './plugins/error';
import { healthRoutes } from './routes/health';
import { qrcodeRoutes } from './routes/qrcode';
import { database } from "./lib/db";
import { authRouter, protectedRoutes } from './routes';

const PORT = Number(process.env.PORT) || 3000;

const app = new Elysia()
  .use(cors())
  .onStart(async () => {
    await database.connect();
    console.log(`🚀 Server is running`);
  })
  .use(authRouter)
  .use(protectedRoutes)
  .use(errorPlugin)
  .listen(PORT);

console.log(`🌐 Qrafthive API is running at ${app.server?.hostname}:${app.server?.port}`);
