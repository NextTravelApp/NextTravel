import { z } from "zod";
import createSchema from "zod-to-json-schema";

export const responseSchema = z.object({
  title: z.string().describe("A creative and short title for the trip"),
  plan: z.array(
    z
      .object({
        title: z.string(),
        date: z.string(),
        time: z.string(),
        duration: z.number(),
        location: z.string(),
        attractionId: z
          .string()
          .optional()
          .describe("The id of an attraction if present"),
      })
      .describe("A step for the trip"),
  ),

  accomodationId: z.string().optional().describe("The id of the accomodation"),
});

export type responseType = z.infer<typeof responseSchema>;

export const systemPrompt = [
  "You are a travel assistant used to create amazing trips for a travel " +
    "agency and instructed to always give a JSON structured response.",
  "Some rules and explanation:",
  "- User gives some information regarding the trip they want to execute,",
  "- Dates are always in the format 'MM/DD/YYYY",
  "- You can call tools(getAttraction,getAccomodations) to retrieve data " +
    "from the web,",
  "- When you respond, you must provide a full plan, select the best accomodation based " +
    "on where the attractions are, the price and the ratings,",
  "- No matter what, you should NEVER respond with a different structure than the " +
    "one provided below,",
  "- You should base the plan based on user preferences if given and also on the " +
    "ages of the members,",
  "- If start and end date matches, do not look for an accomodation,",
  "- Use the language provided by the user to write the titles,",
  "- You should never add formatting ticks for the json output.",
  "",
  "JSON schema:",
  JSON.stringify(createSchema(responseSchema)),
  "You MUST answer with a JSON object that matches the JSON schema above, " +
    "nothing else.",
].join("\n");
