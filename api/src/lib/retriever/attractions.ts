import type { AttractionRequest } from "../ai/tools";
import type { Attraction } from "./types";

export const managers: AttractionManager[] = [];

export interface AttractionManager {
  provider: string;
  search(data: AttractionRequest): Promise<Attraction | null>;
}

export async function searchAttraction(
  data: AttractionRequest,
): Promise<Attraction | null> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.filter((r) => r != null).sort((a, b) => a.price - b.price)[0];
}
