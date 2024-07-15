import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { attractionRequestSchema } from "../../lib/ai/tools";
import { searchAttractions } from "../../lib/retriever/attractions";
import type { Attraction } from "../../lib/retriever/types";
import { authenticated } from "../../middlewares/auth";

export const attractionsRoute = new Hono()
  .post(
    "/",
    authenticated,
    zValidator("json", attractionRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const attractions = await searchAttractions(body);

      return ctx.json(attractions);
    },
  )
  .get("/:id", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    let attraction: Attraction | undefined;

    if (process.env.RETURN_EXAMPLE_DATA) {
      attraction = (
        JSON.parse(
          readFileSync("local/attractions.json", "utf-8"),
        ) as Attraction[]
      ).find((att) => att.id === id);
    } else {
      // TODO
    }

    if (!attraction) {
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );
    }

    return ctx.json(attraction);
  });
