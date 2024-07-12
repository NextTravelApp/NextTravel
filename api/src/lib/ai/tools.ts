import { tool } from "ai";
import { z } from "zod";

function logTool(tool: string, request: unknown) {
  console.log(`[AI] [Tool] ${tool}`, request);
}

export type AttractionsRequest = z.infer<(typeof getAttractions)["parameters"]>;
export const getAttractions = tool({
  description: "Get the best attractions of a location",
  parameters: z.object({
    location: z.string().describe("The location to get the attractions for"),
  }),
  execute: async (request) => {
    // TODO: Implement the logic
    logTool("getAttractions", request);

    return {
      attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
    };
  },
});

export type HotelsRequest = z.infer<(typeof getHotels)["parameters"]>;
export const getHotels = tool({
  description: "Get the best hotels in a specific location",
  parameters: z.object({
    location: z.string().describe("The location to get the hotels for"),
  }),
  execute: async (request) => {
    // TODO: Implement the logic
    logTool("getHotels", request);

    return {
      hotels: [
        {
          id: "h1",
          name: "Hotel 1",
          location: "Outside Paris",
          price: 50,
        },
        {
          id: "h2",
          name: "Hotel 2",
          location: "Eiffel Tower",
          price: 100,
        },
        {
          id: "h3",
          name: "Hotel 3",
          location: "Near the centre",
          price: 75,
        },
      ],
    };
  },
});

export type GetDistanceRequest = z.infer<(typeof getDistance)["parameters"]>;
export const getDistance = tool({
  description:
    "Get the time in seconds between two locations. Locations must be real and not an hotel name",
  parameters: z.object({
    origin: z.string().describe("The origin location"),
    destination: z.string().describe("The destination location"),
  }),
  execute: async (request) => {
    // TODO: Implement the logic
    logTool("getDistance", request);

    return {
      distance: 100,
    };
  },
});
