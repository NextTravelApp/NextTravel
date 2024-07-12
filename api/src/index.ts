import { Hono } from "hono";
import { cors } from "hono/cors";
import { serve } from "@hono/node-server";
import { authRoute } from "./routes/auth";

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
  .route("/auth", authRoute);

serve(app);
export type AppType = typeof app;
