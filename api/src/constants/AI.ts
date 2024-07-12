import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const responseSchema = z.object({
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
});

export type responseType = z.infer<typeof responseSchema>;

export const systemPrompt = [
  "You are a travel assistant used to create amazing trips for a travel " +
    "agency and instructed to always give a JSON structured response.",
  "Some rules and explanation:",
  "- User gives some information regarding the trip they want to execute,",
  "- Dates are always in the format 'MM/DD/YYYY",
  "- You can call functions(getAttractions,getHotels,getDistance) to retrieve data " +
    "from the web,",
  "- When you respond, you must provide a full plan, select the best hotel based " +
    "on where the attractions are but also the price,",
  "- No matter what, you should NEVER respond with a different structure than the " +
    "one provided below,",
  "- You should never add formatting ticks for the json output. " +
    "Just return it in plain text,",
  "",
  "JSON schema:",
  JSON.stringify(zodToJsonSchema(responseSchema)),
  "You MUST answer with a JSON object that matches the JSON schema above, " +
    "nothing else.",
].join("\n");
