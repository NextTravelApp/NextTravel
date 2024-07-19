import { Hono } from "hono";
import { plans } from "../constants/premium";

export const premiumRoute = new Hono().get("/plans", async (ctx) => {
  return ctx.json(plans);
});
