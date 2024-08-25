import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { authRoute } from "./routes/auth";
import { chatRoute } from "./routes/chat";
import { geoRoute } from "./routes/geo";
import { imageRoute } from "./routes/image";
import { planRoute } from "./routes/plan";
import { premiumRoute } from "./routes/premium";
import { retrieverRoute } from "./routes/retriever";
import { systemRoute } from "./routes/system";

const app = new Hono()
  .use(
    cors({
      origin: "*",
      allowHeaders: ["Authorization", "Content-Type", "User-Agent"],
      allowMethods: ["POST", "GET", "OPTIONS", "PUT", "DELETE", "PATCH"],
      exposeHeaders: ["Content-Length", "Content-Type", "Content-Disposition"],
      maxAge: 600,
    }),
  )
  .route("/auth", authRoute)
  .route("/plan", planRoute)
  .route("/retriever", retrieverRoute)
  .route("/image", imageRoute)
  .route("/system", systemRoute)
  .route("/premium", premiumRoute)
  .route("/chat", chatRoute)
  .route("/geo", geoRoute);

serve(app, (info) => {
  console.log(`[Server] Listening on ${info.address}:${info.port}`);
});

export type AppType = typeof app;
export type { responseType } from "./constants/ai";
export type * from "./constants/premium";
export type * from "./constants/requests";
