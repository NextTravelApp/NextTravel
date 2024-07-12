import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { responseType } from "../constants/ai";
import type { Variables } from "../constants/context";
import { searchSchema } from "../constants/requests";
import prisma from "../lib/prisma";
import { authenticated } from "../middlewares/auth";
import { readFileSync } from "node:fs";

export const searchRoute = new Hono<{ Variables: Variables }>()
  .post(
    "/",
    authenticated,
    async (ctx, next) => {
      const user = ctx.get("user");
      if (user.searches >= 10)
        return ctx.json(
          {
            t: "month_limit",
          },
          {
            status: 429,
          },
        );

      return next();
    },
    zValidator("json", searchSchema),
    async (ctx) => {
      const user = ctx.get("user");
      const _body = ctx.req.valid("json");
      // TODO: Connect to AI

      await prisma.user.update({
        where: { id: user.id },
        data: {
          searches: {
            increment: 1,
          },
        },
      });

      let trip: responseType = {
        title: "Empty trip",
        plan: [],
      };

      if (process.env.RETURN_EXAMPLE_DATA)
        trip = JSON.parse(readFileSync("test/data.json", "utf-8"));

      await prisma.searchRequest.create({
        data: {
          userId: user.id,
          title: trip.title,
          data: trip,
        },
      });

      return ctx.json(trip);
    },
  )
  .get("/history", authenticated, async (ctx) => {
    const user = ctx.get("user");

    const searches = await prisma.searchRequest.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return ctx.json(searches);
  });
