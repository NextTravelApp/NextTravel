import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import type { responseType } from "../../constants/ai";
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

    const search = await prisma.searchRequest.findFirst({
      where: {
        OR: [
          {
            id: id,
            userId: ctx.get("user").id,
          },
          {
            id: id,
            public: true,
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
          response: true,
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

      const newBody = {
        ...(search.response as responseType),
      };

      if (body.accomodationId) newBody.accomodationId = body.accomodationId;

      await prisma.searchRequest.update({
        where: {
          id: id,
        },
        data: {
          response: newBody,
          bookmark: body.bookmark,
          public: body.public,
          sharedWith: body.sharedWith,
        },
      });

      return ctx.json(newBody);
    },
  )
  .post("/checkout", authenticated, async (ctx) => {
    const id = ctx.req.param("id");
    const user = ctx.get("user");

    const plan = await prisma.searchRequest.findUnique({
      where: {
        id: id,
        userId: user.id,
      },
      select: {
        request: true,
        response: true,
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
    const data = plan.response as responseType;
    const items: CheckoutItem[] = [];

    for (const step of data.plan) {
      if (step.attractionId) {
        const attraction = await getAttraction(step.attractionId);

        if (attraction)
          items.push({
            type: "attraction",
            name: attraction.name,
            provider: step.attractionId.split("_")[0],
            price: attraction.price,
            url: attraction.checkoutUrl,
          });
      }
    }

    if (data.accomodationId) {
      const accomodation = await getAccomodation(data.accomodationId, {
        checkIn: requestData.startDate,
        checkOut: requestData.endDate,
        location: requestData.location,
        members: requestData.members,
      });

      if (accomodation)
        items.push({
          type: "accomodation",
          name: accomodation.name,
          provider: data.accomodationId.split("_")[0],
          price: accomodation.price,
          url: accomodation.checkoutUrl,
        });
    }

    return ctx.json({
      items,
    } as CheckoutResponse);
  });
