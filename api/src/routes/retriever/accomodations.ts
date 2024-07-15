import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { readFileSync } from "node:fs";
import { accomodationsRequestSchema } from "../../lib/ai/tools";
import { searchAccomodations } from "../../lib/retriever/accomodation";
import type { Accomodation } from "../../lib/retriever/types";
import { authenticated } from "../../middlewares/auth";

export const accomodationsRoute = new Hono()
  .post(
    "/",
    authenticated,
    zValidator("json", accomodationsRequestSchema),
    async (ctx) => {
      const body = ctx.req.valid("json");
      let accomodations: Accomodation[];

      if (process.env.RETURN_EXAMPLE_DATA) {
        accomodations = JSON.parse(
          readFileSync("test/accomodations.json", "utf-8"),
        );
      } else {
        accomodations = await searchAccomodations(body);
      }

      return ctx.json(accomodations);
    },
  )
  .get("/:id", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    let accomodation: Accomodation | undefined;

    if (process.env.RETURN_EXAMPLE_DATA) {
      accomodation = (
        JSON.parse(
          readFileSync("test/accomodations.json", "utf-8"),
        ) as Accomodation[]
      ).find((acc) => acc.id === id);
    } else {
      // TODO
    }

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
