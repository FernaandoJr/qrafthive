import { cors } from "@elysiajs/cors"
import { createContext } from "@qrafttt/api/context"
import { appRouter } from "@qrafttt/api/routers/index"
import { auth } from "@qrafttt/auth"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import "dotenv/config"
import { Elysia } from "elysia"

const app = new Elysia()
	.use(
		cors({
			origin: process.env.CORS_ORIGIN || "",
			methods: ["GET", "POST", "OPTIONS"],
			allowedHeaders: ["Content-Type", "Authorization"],
			credentials: true,
		})
	)
	.all("/api/auth/*", async (context) => {
		const { request, status } = context
		if (["POST", "GET"].includes(request.method)) {
			return auth.handler(request)
		}
		return status(405)
	})
	.all("/trpc/*", async (context) => {
		const res = await fetchRequestHandler({
			endpoint: "/trpc",
			router: appRouter,
			req: context.request,
			createContext: () => createContext({ context }),
		})
		return res
	})
	.get("/", () => "OK")
	.listen(9876, () => {
		console.log("Server is running on http://localhost:9876")
	})
