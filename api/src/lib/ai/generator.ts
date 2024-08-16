import { generateText } from "ai";
import { ai } from ".";
import { systemPrompt } from "../../constants/ai";
import { UnexpectedResponseError } from "./exceptions";

//! WARNING: Ensure that all the variables are escaped properly
export async function generateTrip(
  location: string,
  startDate: Date,
  endDate: Date,
  members: number[],
  locale: string,
  theme?: string,
) {
  const result = await generateText({
    model: ai(process.env.OPENAI_MODEL ?? "gpt-4o"),
    maxToolRoundtrips: 5,
    system: systemPrompt,
    prompt: `I want to visit ${location} from ${startDate.toLocaleDateString("en-US")} to ${endDate.toLocaleDateString("en-US")}.
      I will travel with ${members.length} of the ages ${members.join(", ")} including me.
      My language is ${locale}.
      ${theme ? `My ideal trip theme is ${theme}` : ""}`,
    maxTokens: 4000,
  });

  console.log(
    `[AI] [Generator] Used ${result.usage.totalTokens} tokens (${result.usage.promptTokens} for prompt, ${result.usage.completionTokens} for output)`,
  );

  try {
    return {
      ...JSON.parse(result.text),
      tokens: result.usage.totalTokens,
    };
  } catch (_) {
    throw new UnexpectedResponseError(
      "AI response is not a valid JSON object",
      result.text,
    );
  }
}
