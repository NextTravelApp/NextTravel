import { logger, task } from "@trigger.dev/sdk/v3";
import type { responseType } from "../constants/ai";
import type { searchSchemaType } from "../constants/requests";
import { generateTrip } from "../lib/ai/generator";
import prisma from "../lib/prisma";
import { getImage } from "../lib/unsplash";

export const generateTask = task({
  id: "generate-plan",
  maxDuration: 300,
  run: async (
    payload: {
      request: searchSchemaType;
      user: {
        id: string;
        language: string;
      };
      exampleResponse?: responseType;
    },
    { ctx },
  ) => {
    logger.info("Generating trip");

    let trip: responseType & {
      tokens?: number;
    };

    if (payload.exampleResponse) {
      logger.info("Using example response");
      trip = payload.exampleResponse;
    } else {
      logger.info(`Generating trip with ${process.env.OPENAI_MODEL}`);
      trip = await generateTrip(
        payload.request.location as string,
        new Date(payload.request.startDate as string),
        new Date(payload.request.endDate as string),
        payload.request.members,
        payload.user.language,
        payload.request.theme?.trim() || undefined,
      );
    }

    logger.info("Trip generated");

    const image = await getImage(payload.request.location);

    const job = await prisma.requestJob.delete({
      where: {
        triggerId: ctx.run.id,
      },
    });

    const record = await prisma.searchRequest.create({
      data: {
        id: job.id,
        userId: payload.user.id,
        title: trip.title,
        image: image?.url,
        imageAttributes: image?.author,
        location: trip.location,
        request: payload.request,
        response: {
          ...trip,
          tokens: undefined,
        },
        tokens: trip.tokens ?? 0,
        date: new Date(payload.request.startDate),
      },
    });

    return record;
  },
});
