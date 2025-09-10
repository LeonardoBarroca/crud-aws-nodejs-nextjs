import cors from "@fastify/cors";
import Fastify from "fastify";
import routes from "./routes/index.js";
import staticRoutes from "./routes/static.routes.js";

export function buildApp() {
  const app = Fastify({
    logger: process.env.FASTIFY_LOGGER === "false" ? false : true,
  });

  app.register(cors, {
    origin: process.env.CORS_ORIGIN || true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  });

  app.register(routes, { prefix: "/api" });
  app.register(staticRoutes, { prefix: "/api" });

  app.get("/", async () => ({ ok: true }));

  app.get("/healthz", async () => ({ status: "ok" }));

  // Error handling for uncaught exceptions
  process.on("uncaughtException", (err) => {
    app.log.error("Uncaught Exception:", err);
  });
  process.on("unhandledRejection", (reason) => {
    app.log.error("Unhandled Rejection:", reason);
  });

  return app;
}
