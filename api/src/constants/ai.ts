import { z } from "zod";
import createSchema from "zod-to-json-schema";

export const responseSchema = z.object({
  title: z.string().describe("A creative and short title for the trip"),
  dates: z
    .array(
      z.object({
        date: z.string().describe("The date of the step"),
        title: z.string().describe("The title of the day"),
        steps: z.array(
          z
            .object({
              title: z.string().describe("The title of the step"),
              time: z.string().describe("The time of the step"),
              duration: z.number().describe("The duration of the step"),
              location: z.string().describe("The location of the step"),
            })
            .describe("A step for the trip"),
        ),
      }),
    )
    .describe("The dates of the trip"),
});

export type responseType = z.infer<typeof responseSchema>;

export const systemPrompt = [
  "You are a travel assistant used to create amazing trips for a travel " +
    "agency and instructed to always give a JSON structured response.",
  "Some rules and explanation:",
  "- User gives some information regarding the trip they want to execute,",
  "- Dates are always in the format MM/DD/YYYY,",
  "- When you respond, you must provide a full plan based on user preferences, ages and trip duration,",
  "- No matter what, you should NEVER respond with a different structure than the " +
    "one provided below,",
  "- You should give a creative and short name to the trip and its days based on what is included in it,",
  "- Use the language provided by the user to write the titles,",
  "- You should never add formatting ticks for the json output. " +
    "Just return it in plain text,",
  "",
  "JSON schema:",
  JSON.stringify(createSchema(responseSchema)),
  "You MUST answer with a JSON object that matches the JSON schema above, " +
    "nothing else.",
].join("\n");

export const chatSystemPrompt = [
  "You are a travel assistant, users can ask you anything related to travels.",
  "Some rules and explanation:",
  "- You should always be polite, helpful and professional,",
  "- You can call functions to retrieve user data,",
  "- Respond in the user's language,",
  "- Never go out of the travel context,",
].join("\n");
