import { tool } from "ai";
import { z } from "zod";
import prisma from "../prisma";
import { searchAccomodations } from "../retriever/accomodations";
import { searchAttractions } from "../retriever/attractions";

function logTool(tool: string, request: unknown) {
  console.log(`[AI] [Tool] ${tool}`, request);
}

export const attractionRequestSchema = z.object({
  name: z.string().describe("The name of the attraction"),
  location: z.string().describe("The city of the attraction"),
});
export type AttractionRequest = z.infer<typeof attractionRequestSchema>;
export const getAttraction = tool({
  description: "Get info and pricing about a specific attraction",
  parameters: attractionRequestSchema,
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
    parameters: z.object({}),
    execute: async () => {
      return await prisma.searchRequest.findMany({
        where: {
          userId: id,
        },
      });
    },
  });
