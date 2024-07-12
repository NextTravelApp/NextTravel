import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { rateLimiter } from "hono-rate-limiter";
import type { Variables } from "../constants/context";
import { searchSchema } from "../constants/requests";
import { authenticated } from "../middlewares/auth";

const limiter = rateLimiter({
  windowMs: 60 * 1000,
  limit: 1,
  standardHeaders: "draft-6",
  keyGenerator: (ctx) => ctx.get("jwtPayload").user,
});

export const searchRoute = new Hono<{ Variables: Variables }>().post(
  "/",
  authenticated,
  // limiter,
  zValidator("json", searchSchema),
  async (ctx) => {
    const user = ctx.get("user");
    const body = ctx.req.valid("json");

    console.log(body);

    return ctx.json("success");
  },
);
