import { readdirSync } from "node:fs";
import path from "node:path";
import { Hono } from "hono";
import { cors } from "hono/cors";

export const app = new Hono();

app.use(
  cors({
    origin: "*",
    allowHeaders: ["Authorization", "Content-Type", "User-Agent"],
    allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
    exposeHeaders: ["Content-Length", "Content-Type", "Content-Disposition"],
    maxAge: 600,
  }),
);

for (const file of readdirSync(path.join(__dirname, "routes"))) {
  if (file.endsWith(".ts") || file.endsWith(".js")) {
    import(`./routes/${file}`).then((module) => {
      app.route(`/${file.split(".")[0]}`, module.default);
      console.log(`[Route] /${file.split(".")[0]} loaded`);
    });
  }
}

export default app;
