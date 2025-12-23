export const env = {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb+srv://...",
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-key-change-in-production",
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET || "your-better-auth-secret",
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL || "http://localhost:3000"
} as const;
