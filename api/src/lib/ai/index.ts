import { createOpenAI } from "@ai-sdk/openai";

export const ai = createOpenAI({
  baseURL: process.env.OPENAI_API_URL,
  apiKey: process.env.OPENAI_API_KEY,
});
