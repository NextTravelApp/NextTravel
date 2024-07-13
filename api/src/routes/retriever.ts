import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  accomodationsRequestSchema,
  attractionRequestSchema,
  transportRequestSchema,
} from "../lib/ai/tools";
import { searchAccomodations } from "../lib/retriever/accomodation";
import { searchAttractions } from "../lib/retriever/attractions";
import { searchTransports } from "../lib/retriever/transports";
import { authenticated } from "../middlewares/auth";

export const retrieverRoute = new Hono()
  .post(
    "/accomodations",
    authenticated,
    zValidator("json", accomodationsRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const hotels = await searchAccomodations(body);

      return ctx.json(hotels);
    },
  )
  .post(
    "/attractions",
    authenticated,
    zValidator("json", attractionRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const attractions = await searchAttractions(body);

      return ctx.json(attractions);
    },
  )
  .post(
    "/transports",
    authenticated,
    zValidator("json", transportRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const transports = await searchTransports(body);

      return ctx.json(transports);
    },
  );
