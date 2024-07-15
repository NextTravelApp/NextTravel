import { Hono } from "hono";
import { accomodationsRoute } from "./retriever/accomodations";
import { attractionsRoute } from "./retriever/attractions";

export const retrieverRoute = new Hono()
  .route("/accomodations", accomodationsRoute)
  .route("/attractions", attractionsRoute);
