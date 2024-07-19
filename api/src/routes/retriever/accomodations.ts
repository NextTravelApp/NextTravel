import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { accomodationsRequestSchema } from "../../lib/ai/tools";
import {
  getAccomodation,
  searchAccomodations,
} from "../../lib/retriever/accomodations";
import { authenticated } from "../../middlewares/auth";
import { validatorCallback } from "../../middlewares/validator";

export const accomodationsRoute = new Hono()
  .post(
    "/",
    authenticated,
    zValidator("json", accomodationsRequestSchema, validatorCallback),
    async (ctx) => {
      const body = ctx.req.valid("json");
      const accomodations = await searchAccomodations(body);

      return ctx.json(accomodations);
    },
  )
  .get("/:id", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const accomodation = await getAccomodation(id);

    if (!accomodation) {
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );
    }

    return ctx.json(accomodation);
  });
