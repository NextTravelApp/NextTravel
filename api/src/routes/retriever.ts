import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  attractionRequestSchema,
  transportRequestSchema,
} from "../lib/ai/tools";
import { searchAttractions } from "../lib/retriever/attractions";
import { searchTransports } from "../lib/retriever/transports";
import { authenticated } from "../middlewares/auth";
import { accomodationsRoute } from "./retriever/accomodations";

export const retrieverRoute = new Hono()
  .route("/accomodations", accomodationsRoute)
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
