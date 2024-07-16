import { Hono } from "hono";
import type { Variables } from "../../constants/context";
import { checkoutRoute } from "./checkout";
import { paidRoute } from "./paid";
import { searchRoute } from "./search";

export const planRoute = new Hono<{ Variables: Variables }>()
  .route("/", searchRoute)
  .route("/", paidRoute)
  .route("/checkout", checkoutRoute);
