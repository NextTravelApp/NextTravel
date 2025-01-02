import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import { z } from "zod";
import { validatorCallback } from "../middlewares/validator";

export const geoRoute = new Hono().get(
  "/reverse",
  zValidator(
    "query",
    z.object({
      latitude: z.string(),
      longitude: z.string(),
    }),
    validatorCallback,
  ),
  async (ctx) => {
    const { latitude, longitude } = ctx.req.valid("query");
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
      {
        headers: {
          "User-Agent": "NextTravel-Proxy/1.0.0",
        },
      },
    );

    ctx.header("Cache-Control", "public, max-age=86400");

    const data = await res.json();

    if (!res.ok)
      return ctx.json(
        {
          error: "Failed to fetch data",
          data,
        },
        res.status as ContentfulStatusCode,
      );

    return ctx.json(
      data.address.city ??
        data.address.town ??
        data.address.village ??
        data.address.county,
    );
  },
);
