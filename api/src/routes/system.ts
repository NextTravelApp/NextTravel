import { Hono } from "hono";
import { system } from "../middlewares/system";

export const systemRoute = new Hono().use("*", system);
