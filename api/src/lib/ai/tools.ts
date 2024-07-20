import { tool } from "ai";
import { z } from "zod";
import { searchAccomodations } from "../retriever/accomodations";
import { searchAttractions } from "../retriever/attractions";

function logTool(tool: string, request: unknown) {
  console.log(`[AI] [Tool] ${tool}`, request);
}

export const attractionRequestSchema = z.object({
  name: z.string().describe("Name of the attraction"),
  location: z.string().describe("City of the attraction"),
});
export type AttractionRequest = z.infer<typeof attractionRequestSchema>;
export const getAttraction = tool({
  description: "Get info about a specific attraction",
  parameters: attractionRequestSchema,
  execute: async (request) => {
    logTool("getAttractions", request);
    return await searchAttractions(request);
  },
});

export const accomodationsRequestSchema = z.object({
  location: z.string().describe("Hotel location"),
  members: z.array(z.number()).describe("Member ages"),
  checkIn: z.string().date().describe("Date in YYYY-MM-DD"),
  checkOut: z.string().date().describe("Date in YYYY-MM-DD"),
});
export type AccomodationsRequest = z.infer<typeof accomodationsRequestSchema>;
export const getAccomodations = tool({
  description: "Get the accomodations for a location",
  parameters: accomodationsRequestSchema,
  execute: async (request) => {
    if (request.checkIn === request.checkOut) return [];

    logTool("getAccomodations", request);
    return await searchAccomodations(request);
  },
});
