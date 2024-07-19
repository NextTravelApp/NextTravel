import { readFileSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { responseType } from "../../constants/ai";
import type { Variables } from "../../constants/context";
import { getPlan } from "../../constants/premium";
import { searchSchema } from "../../constants/requests";
import { generateTrip } from "../../lib/ai/generator";
import prisma from "../../lib/prisma";
import { getImage } from "../../lib/unsplash";
import { authenticated } from "../../middlewares/auth";
import { validatorCallback } from "../../middlewares/validator";

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
      let trip: responseType & {
        tokens?: number;
      };

      if (process.env.RETURN_EXAMPLE_DATA) {
        trip = JSON.parse(readFileSync("local/search.json", "utf-8"));
      } else {
        trip = await generateTrip(
          body.location as string,
          new Date(body.startDate as string),
          new Date(body.endDate as string),
          body.members,
          user.language,
        );
      }

      await prisma.user.update({
        where: { id: user.id },
        data: {
          searches: {
            increment: 1,
          },
        },
      });

      const image = await getImage(body.location as string);
      const record = await prisma.searchRequest.create({
        data: {
          userId: user.id,
          title: trip.title,
          image: image?.url,
          imageAttributes: image?.author,
          location: body.location as string,
          request: body,
          response: {
            ...trip,
            tokens: undefined,
          },
          tokens: trip.tokens ?? 0,
          date: new Date(body.startDate),
        },
      });

      return ctx.json({
        ...trip,
        tokens: undefined,
        id: record.id,
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
