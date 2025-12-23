import { Elysia } from "elysia";
import { auth } from "../config/auth";
import type { AuthContext } from "../types";

export const authMiddleware = new Elysia({ name: "auth" })
  .derive(async ({ request, set }) => {
    try {
      // Better-Auth usa cookies automaticamente via request
      const session = await auth.api.getSession({ 
        headers: request.headers
      });
      
      if (!session?.user) {
        set.status = 401;
        throw new Error("Não autenticado");
      }

      const result: AuthContext = { 
        user: session.user as any, 
        session 
      };
      
      return result;
    } catch (error) {
      set.status = 401;
      throw new Error("Não autenticado");
    }
  })
  .as("global");