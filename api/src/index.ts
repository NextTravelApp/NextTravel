import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { retrieverRoute } from "./routes/retriever";
import { authRoute } from "./routes/auth";
import { imageRoute } from "./routes/image";
import { searchRoute } from "./routes/search";

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
  .route("/search", searchRoute)
  .route("/retriever", retrieverRoute)
  .route("/image", imageRoute);

serve(app);
export type AppType = typeof app;
