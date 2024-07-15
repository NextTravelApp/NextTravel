import { readFileSync } from "node:fs";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { transportRequestSchema } from "../../lib/ai/tools";
import { searchTransports } from "../../lib/retriever/transports";
import type { Transport } from "../../lib/retriever/types";
import { authenticated } from "../../middlewares/auth";

export const transportsRoute = new Hono()
  .post(
    "/",
    authenticated,
    zValidator("json", transportRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const transports = await searchTransports(body);

      return ctx.json(transports);
    },
  )
  .get("/:id", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    let transport: Transport | undefined;

    if (process.env.RETURN_EXAMPLE_DATA) {
      transport = (
        JSON.parse(
          readFileSync("local/transports.json", "utf-8"),
        ) as Transport[]
      ).find((att) => att.id === id);
    } else {
      // TODO
    }

    if (!transport) {
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );
    }

    return ctx.json(transport);
  });
