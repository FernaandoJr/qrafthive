import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { database } from "../lib/db";
import { env } from "./env";

export const auth = betterAuth({
  database: mongodbAdapter(await database.getDb()),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },
  secret: env.BETTER_AUTH_SECRET,
  basePath: "/api/auth",
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.BETTER_AUTH_URL],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 dias
    updateAge: 60 * 60 * 24, // 1 dia
  },
});

export type Session = typeof auth.$Infer.Session;