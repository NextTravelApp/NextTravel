import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { transportRequestSchema } from "../../lib/ai/tools";
import { getTransport, searchTransports } from "../../lib/retriever/transports";
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
    const transport = getTransport(id);

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
