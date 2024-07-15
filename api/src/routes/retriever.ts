import { Hono } from "hono";
import { accomodationsRoute } from "./retriever/accomodations";
import { attractionsRoute } from "./retriever/attractions";
import { transportsRoute } from "./retriever/transports";

export const retrieverRoute = new Hono()
  .route("/accomodations", accomodationsRoute)
  .route("/attractions", attractionsRoute)
  .route("/transports", transportsRoute);
