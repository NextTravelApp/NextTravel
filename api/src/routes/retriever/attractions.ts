import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { attractionRequestSchema } from "../../lib/ai/tools";
import {
  getAttraction,
  searchAttractions,
} from "../../lib/retriever/attractions";
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
    const attraction = getAttraction(id);

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
