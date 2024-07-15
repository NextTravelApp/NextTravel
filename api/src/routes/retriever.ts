import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { transportRequestSchema } from "../lib/ai/tools";
import { searchTransports } from "../lib/retriever/transports";
import { authenticated } from "../middlewares/auth";
import { accomodationsRoute } from "./retriever/accomodations";
import { attractionsRoute } from "./retriever/attractions";
import { transportsRoute } from "./retriever/transports";

export const retrieverRoute = new Hono()
  .route("/accomodations", accomodationsRoute)
  .route("/attractions", attractionsRoute)
  .route("/transports", transportsRoute);
