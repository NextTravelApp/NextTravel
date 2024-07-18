import { Hono } from "hono";
import { z } from "zod";
import { getImage } from "../lib/unsplash";
import { zValidator } from "../middlewares/validator";

export const imageRoute = new Hono().get(
  "/search",
  zValidator(
    "query",
    z.object({
      location: z.string(),
    }),
  ),
  async (ctx) => {
    const { location } = ctx.req.valid("query");
    const image = await getImage(location);
    if (!image) return ctx.json({ t: "not_found" }, 404);

    ctx.header("Cache-Control", "public, max-age=604800");

    return ctx.json(image);
  },
);
