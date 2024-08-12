import { convertToCoreMessages, generateText } from "ai";
import { ai } from ".";
import { chatSystemPrompt } from "../../constants/ai";
import prisma from "../prisma";
import { editPlanResponse, getUserSearches } from "./tools";

export async function chat(user: string, message: string) {
  const chatModel = ai.chat(process.env.OPENAI_CHAT_MODEL ?? "gpt-3.5-turbo", {
    user,
  });
  await prisma.chatMessage.create({
    data: {
      userId: user,
      bot: false,
      content: message,
    },
  });

  const messages = await prisma.chatMessage.findMany({
    where: {
      userId: user,
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  const result = await generateText({
    model: chatModel,
    system: chatSystemPrompt,
    messages: convertToCoreMessages(
      messages.map((msg) => ({
        role: msg.bot ? "assistant" : "user",
        content: msg.content,
      })),
    ),
    maxTokens: 1000,
    maxToolRoundtrips: 3,
    tools: {
      getUserSearches: getUserSearches(user),
      editPlanResponse: editPlanResponse(user),
    },
  });

  console.log(
    `[AI] [Chat] Used ${result.usage.totalTokens} tokens (${result.usage.promptTokens} for prompt, ${result.usage.completionTokens} for output)`,
  );

  const diffs = result.responseMessages
    .filter((call) => call.role === "tool")
    .flatMap((call) => call.content)
    .filter((content) => content.toolName === "editPlanResponse")
    .map((content) => content.result) as {
    added: string[];
    removed: string[];
  }[];

  const added = diffs.flatMap((diff) => diff.added);
  const removed = diffs.flatMap((diff) => diff.removed);
  const data = diffs.length > 0 ? { added, removed } : undefined;

  const response = await prisma.chatMessage.create({
    data: {
      userId: user,
      bot: true,
      content: result.text,
      tokens: result.usage.totalTokens,
      data,
    },
  });

  return response;
}
