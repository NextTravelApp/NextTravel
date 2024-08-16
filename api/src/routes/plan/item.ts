import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import type { Variables } from "../../constants/context";
import {
  type searchSchemaType,
  searchUpdateSchema,
} from "../../constants/requests";
import prisma from "../../lib/prisma";
import { getAccomodation } from "../../lib/retriever/accomodations";
import { getAttraction } from "../../lib/retriever/attractions";
import { authenticated } from "../../middlewares/auth";
import { validatorCallback } from "../../middlewares/validator";

export type CheckoutItem = {
  type: "attraction" | "accomodation" | "fee";
  name: string;
  provider: string;
  price: number;
  url?: string;
};

export type CheckoutResponse = {
  items: CheckoutItem[];
};

export const itemRoute = new Hono<{ Variables: Variables }>()
  .get("/", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const user = ctx.get("user");

    const search = await prisma.searchRequest.findFirst({
      where: {
        OR: [
          {
            id: id,
            userId: user.id,
          },
          {
            id: id,
            public: true,
          },
          {
            id: id,
            sharedWith: {
              has: user.id,
            },
          },
        ],
      },
    });

    if (!search)
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );

    return ctx.json(search);
  })
  .patch(
    "/",
    authenticated,
    zValidator("json", searchUpdateSchema, validatorCallback),
    async (ctx) => {
      const id = ctx.req.param("id");
      const body = ctx.req.valid("json");

      const search = await prisma.searchRequest.findUnique({
        where: {
          id: id,
          userId: ctx.get("user").id,
        },
        select: {
          attractions: true,
        },
      });

      if (!search)
        return ctx.json(
          {
            t: "not_found",
          },
          {
            status: 404,
          },
        );

      await prisma.searchRequest.update({
        where: {
          id: id,
        },
        data: {
          attractions: body.attractionId
            ? !search.attractions.includes(body.attractionId)
              ? {
                  push: body.attractionId,
                }
              : {
                  set: search.attractions.filter(
                    (id) => id !== body.attractionId,
                  ),
                }
            : undefined,
          accomodation: body.accomodationId,
          bookmark: body.bookmark,
          public: body.public,
        },
      });

      return ctx.json({ success: true });
    },
  )
  .get("/shared", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const user = ctx.get("user");

    const search = await prisma.searchRequest.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        sharedWith: true,
      },
    });

    if (!search)
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: search.sharedWith,
        },
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return ctx.json(users);
  })
  .post(
    "/share",
    authenticated,

    zValidator(
      "json",
      z.object({
        email: z.string().email(),
      }),
      validatorCallback,
    ),
    async (ctx) => {
      const id = ctx.req.param("id");
      const body = ctx.req.valid("json");
      const user = ctx.get("user");

      const search = await prisma.searchRequest.findUnique({
        where: {
          id: id,
          userId: user.id,
        },
        select: {
          sharedWith: true,
        },
      });

      if (!search)
        return ctx.json(
          {
            t: "not_found",
          },
          {
            status: 404,
          },
        );

      const sharedWith = search.sharedWith;
      const target = await prisma.user.findUnique({
        where: {
          email: body.email,
        },
        select: {
          id: true,
        },
      });

      if (!target)
        return ctx.json(
          {
            t: "not_found",
          },
          {
            status: 404,
          },
        );

      if (!sharedWith.includes(target.id))
        await prisma.searchRequest.update({
          where: {
            id: id,
          },
          data: {
            sharedWith: {
              push: target.id,
            },
          },
        });

      return ctx.json({
        success: true,
      });
    },
  )
  .delete("/shared/:userId", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const userId = ctx.req.param("userId");
    const user = ctx.get("user");

    const search = await prisma.searchRequest.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
    });

    if (!search)
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );

    await prisma.searchRequest.update({
      where: {
        id: id,
      },
      data: {
        sharedWith: {
          set: search.sharedWith.filter((id) => id !== userId),
        },
      },
    });

    return ctx.json({
      success: true,
    });
  })
  .post("/checkout", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const user = ctx.get("user");

    const plan = await prisma.searchRequest.findFirst({
      where: {
        OR: [
          {
            id: id,
            userId: user.id,
          },
          {
            id: id,
            public: true,
          },
          {
            id: id,
            sharedWith: {
              has: user.id,
            },
          },
        ],
      },
      select: {
        request: true,
        attractions: true,
        accomodation: true,
      },
    });

    if (!plan)
      return ctx.json(
        {
          t: "not_found",
        },
        {
          status: 404,
        },
      );

    const requestData = plan.request as searchSchemaType;
    const items: CheckoutItem[] = [];

    for (const extra of plan.attractions) {
      const attraction = await getAttraction(extra);

      if (attraction)
        items.push({
          type: "attraction",
          name: attraction.name,
          provider: extra.split("_")[0],
          price: attraction.price,
          url: attraction.checkoutUrl,
        });
    }

    if (plan.accomodation) {
      const accomodation = await getAccomodation(plan.accomodation, {
        checkIn: requestData.startDate,
        checkOut: requestData.endDate,
        location: requestData.location,
        members: requestData.members,
      });

      if (accomodation)
        items.push({
          type: "accomodation",
          name: accomodation.name,
          provider: plan.accomodation.split("_")[0],
          price: accomodation.price,
          url: accomodation.checkoutUrl,
        });
    }

    return ctx.json({
      items,
    } as CheckoutResponse);
  });
