import { Elysia } from "elysia";
import { authRoutes } from "./auth";
import { authMiddleware } from "../middleware/auth";
import { qrcodeRoutes } from "./qrcode";
import { healthRoutes } from "./health";

// Rotas de autenticação (Better-Auth automático)
export const authRouter = new Elysia()
    .use(authRoutes);

// Rotas protegidas (exemplo)
export const protectedRoutes = new Elysia({ prefix: "/api" })
    .use(authMiddleware)
    .group('/v1', (app) => app.use(qrcodeRoutes).use(healthRoutes))

