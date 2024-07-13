import { readFileSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createApi } from "unsplash-js";
import type { z } from "zod";
import type { responseType } from "../constants/ai";
import type { Variables } from "../constants/context";
import { searchSchema } from "../constants/requests";
import prisma from "../lib/prisma";
import { authenticated } from "../middlewares/auth";

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
      const body = ctx.req.valid("json");

      if (body.id) {
        const search = await prisma.searchRequest.findUnique({
          where: {
            id: body.id,
          },
          select: {
            id: true,
            response: true,
          },
        });

        if (search)
          return ctx.json({
            ...(search.response as responseType),
            id: search.id,
          });
      }

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

      const unsplash = createApi({
        accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
      });

      const { response: photos } = await unsplash.search.getPhotos({
        query: body.location as string,
        perPage: 1,
        plus: "none",
      });

      const record = await prisma.searchRequest.create({
        data: {
          userId: user.id,
          title: trip.title,
          image: photos?.results[0].urls.small,
          imageAttributes: photos?.results[0].user.links.html,
          location: body.location as string,
          request: body,
          response: trip,
        },
      });

      return ctx.json({
        ...trip,
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
      select: {
        id: true,
        title: true,
        location: true,
        createdAt: true,
        image: true,
        imageAttributes: true,
      },
    });

    return ctx.json(searches);
  })
  .get("/popular", async (ctx) => {
    const searches = await prisma.popularLocations.findMany();
    return ctx.json(searches);
  });
