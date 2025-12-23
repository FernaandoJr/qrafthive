import { Elysia } from "elysia";
import { auth } from "../config/auth";

// Better-Auth gera as rotas automaticamente
// Basta expor o handler
export const authRoutes = new Elysia()
  .all("/api/auth/*", async ({ request }) => {
    return auth.handler(request);
  });