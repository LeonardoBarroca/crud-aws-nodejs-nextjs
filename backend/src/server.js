import dotenv from "dotenv";
import { buildApp } from "./app.js";
dotenv.config();

const app = buildApp();
const PORT = process.env.PORT || 3000;

app.listen({ port: PORT, host: "0.0.0.0" })
  .then((address) => {
    app.log.info(`Server listening on ${address}`);
  })
  .catch(err => {
    app.log.error(err);
    process.exit(1);
  });

// Graceful shutdown
process.on("SIGINT", async () => {
  app.log.info("SIGINT received. Shutting down gracefully...");
  await app.close();
  process.exit(0);
});
process.on("SIGTERM", async () => {
  app.log.info("SIGTERM received. Shutting down gracefully...");
  await app.close();
  process.exit(0);
});
