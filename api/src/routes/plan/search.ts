import { readFileSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { tasks } from "@trigger.dev/sdk/v3";
import { Hono } from "hono";
import type { Variables } from "../../constants/context";
import { getPlan } from "../../constants/premium";
import { searchSchema } from "../../constants/requests";
import prisma from "../../lib/prisma";
import { authenticated } from "../../middlewares/auth";
import { validatorCallback } from "../../middlewares/validator";
import type { generateTask } from "../../trigger/generate";

export const searchRoute = new Hono<{ Variables: Variables }>()
  .post(
    "/",
    authenticated,
    zValidator("json", searchSchema, validatorCallback),
    async (ctx) => {
      const user = ctx.get("user");
      const body = ctx.req.valid("json");

      if (user.searches >= getPlan(user.plan).limit)
        return ctx.json(
          {
            t: "month_limit",
          },
          {
            status: 429,
          },
        );

      console.log("[Plan] Begin plan create");

      await prisma.user.update({
        where: { id: user.id },
        data: {
          searches: {
            increment: 1,
          },
        },
      });

      const task = await tasks.trigger<typeof generateTask>("generate-plan", {
        request: body,
        user: {
          id: user.id,
          language: user.language,
        },
        exampleResponse: process.env.RETURN_EXAMPLE_DATA
          ? JSON.parse(readFileSync("local/search.json", "utf-8"))
          : undefined,
      });

      const job = await prisma.requestJob.create({
        data: {
          userId: user.id,
          request: body,
          triggerId: task.id,
        },
      });

      return ctx.json({
        id: job.id,
      });
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
      omit: {
        request: true,
        response: true,
      },
    });

    return ctx.json(searches);
  })
  .get("/popular", async (ctx) => {
    const searches = await prisma.popularLocations.findMany();

    ctx.header("Cache-Control", "public, max-age=3600");

    return ctx.json(searches);
  });
