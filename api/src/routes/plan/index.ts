import { Hono } from "hono";
import type { Variables } from "../../constants/context";
import { itemRoute } from "./item";
import { searchRoute } from "./search";

export const planRoute = new Hono<{ Variables: Variables }>()
  .route("/", searchRoute)
  .route("/:id", itemRoute);
