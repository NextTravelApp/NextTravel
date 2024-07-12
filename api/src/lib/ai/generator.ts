import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { systemPrompt } from "../../constants/AI";
import { UnexpectedResponseError } from "./exceptions";
import { getAccomodations, getAttraction, getTransport } from "./tools";

const ai = createOpenAI({
  baseURL: process.env.OPENAI_API_URL,
});

//! WARNING: Ensure that all the variables are escaped properly
export async function generateTrip(
  location: string,
  startDate: Date,
  endDate: Date,
  members: number[],
  theme?: string,
) {
  const result = await generateText({
    model: ai("gpt-4o"),
    maxToolRoundtrips: 5,
    system: systemPrompt,
    prompt: `I want to visit ${location} from ${startDate.toLocaleDateString("en-US")} to ${endDate.toLocaleDateString("en-US")}.
      I will travel with ${members.length} of the ages ${members.join(", ")} including me.
      ${theme ? `My ideal trip theme is ${theme}` : ""}`,
    maxTokens: 1000,
    tools: {
      getAttraction,
      getAccomodations,
      getTransport,
    },
  });

  // TODO: Log the usage to a database
  console.log(`[AI] Used ${result.usage.totalTokens} tokens`);

  try {
    return JSON.parse(result.text);
  } catch (_) {
    throw new UnexpectedResponseError(
      "AI response is not a valid JSON object",
      result.text,
    );
  }
}
