import { tool } from "ai";
import { z } from "zod";
import { responseSchema } from "../../constants/ai";
import prisma from "../prisma";
import { searchAccomodations } from "../retriever/accomodations";
import { searchAttractions } from "../retriever/attractions";

function logTool(tool: string, request: unknown) {
  console.log(`[AI] [Tool] ${tool}`, request);
}

export const attractionsRequestSchema = z.object({
  location: z.string().describe("The city of the attraction"),
});
export type AttractionsRequest = z.infer<typeof attractionsRequestSchema>;
export const getAttractions = tool({
  description: "Get info and pricing about attractions in a city",
  parameters: attractionsRequestSchema,
  execute: async (request) => {
    logTool("getAttractions", request);
    return await searchAttractions(request);
  },
});

export const accomodationsRequestSchema = z.object({
  location: z.string().describe("The location to get the hotels for"),
  members: z.array(z.number()).describe("The ages of the members"),
  checkIn: z.string().date().describe("The check-in date in YYYY-MM-DD"),
  checkOut: z.string().date().describe("The check-out date in YYYY-MM-DD"),
});
export type AccomodationsRequest = z.infer<typeof accomodationsRequestSchema>;
export const getAccomodations = tool({
  description: "Get the best accomodations in a specific location",
  parameters: accomodationsRequestSchema,
  execute: async (request) => {
    if (request.checkIn === request.checkOut) return [];

    logTool("getAccomodations", request);
    return await searchAccomodations(request, 10);
  },
});

export const getUserSearches = (id: string) =>
  tool({
    description: "Get the searches made by the current user",
    parameters: z.object({
      location: z.string().describe("The location of the plan"),
    }),
    execute: async (request) => {
      logTool("getUserSearches", request);

      return await prisma.searchRequest.findMany({
        where: {
          userId: id,
          location: {
            contains: request.location,
            mode: "insensitive",
          },
        },
        orderBy: {
          date: "desc",
        },
        take: 2,
      });
    },
  });

export const editPlanResponse = (user: string) =>
  tool({
    description: "Edit the response field of a plan",
    parameters: z.object({
      id: z.string().describe("The id of the plan"),
      response: responseSchema.describe("The new response for the plan"),
      diff: z
        .object({
          removed: z
            .array(z.string())
            .describe("Readable name for removed steps, empty if none"),
          added: z
            .array(z.string())
            .describe("Readable name for added steps, empty if none"),
        })
        .describe("The diff applied to this response"),
    }),
    execute: async (request) => {
      logTool("editPlanResponse", request);

      await prisma.searchRequest.update({
        where: {
          id: request.id,
          userId: user,
        },
        data: {
          response: request.response,
        },
      });

      return request.diff;
    },
  });
