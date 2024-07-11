import { createOpenAI } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { z } from "zod";

const system =
  "You are a travel assistant. " +
  "User gives some information regarding the trip they want to execute. " +
  "You can call functions(getAttractions,getHotels,getDistance) to retrieve data from the web. " +
  "When you have decided you must respond using the respond function." +
  "When you respond, you must provide a full plan, select the best hotel based on where the attractions are but also the price. " +
  "After calling the respond function, just return true as text.";

const ai = createOpenAI({
  baseURL: process.env.OPENAI_API_URL,
});

async function main() {
  const result = await generateText({
    model: ai("gpt-4-turbo"),
    maxToolRoundtrips: 5,
    system,
    prompt: "I want to visit Paris for 2 days in summer",
    maxTokens: 1000,
    tools: {
      getAttractions: tool({
        description: "Get the best attractions in the city",
        parameters: z.object({
          city: z.string().describe("The city to get the attractions for"),
        }),
        execute: async (response) => {
          console.log(response);

          return {
            attractions: ["Eiffel Tower", "Louvre Museum", "Notre-Dame"],
          };
        },
      }),

      getHotels: tool({
        description: "Get the best hotels in the city",
        parameters: z.object({
          city: z.string().describe("The city to get the hotels for"),
        }),
        execute: async (response) => {
          console.log(response);

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
      }),

      getDistance: tool({
        description: "Get the time in seconds between two locations",
        parameters: z.object({
          origin: z.string().describe("The origin location"),
          destination: z.string().describe("The destination location"),
        }),
        execute: async (response) => {
          console.log(response);
          return {
            distance: 100,
          };
        },
      }),

      respond: tool({
        description: "Respond to the user query. Must always be called",
        parameters: z.object({
          plan: z
            .array(
              z
                .object({
                  date: z.string().describe("The date of the point"),
                  time: z.string().describe("The time of the point"),
                  duration: z.number().describe("The duration of the point"),
                  location: z.string().describe("The location of the point"),
                  attraction: z
                    .string()
                    .optional()
                    .describe("The attraction of the point"),
                })
                .describe("A step for the trip"),
            )
            .describe("The plan for the trip"),

          hotelId: z.string().optional().describe("The hotel id to book"),
        }),
        execute: async (response) => {
          console.log(response);
          return true;
        },
      }),
    },
  });

  console.log(`Used ${result.usage.totalTokens} tokens`);
  return result.text;
}

main().then(console.log);
