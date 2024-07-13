import type { AttractionRequest } from "../ai/tools";
import { WeGoTrip } from "./implementations/attractions";
import type { Attraction } from "./types";

export const managers: AttractionManager[] = [new WeGoTrip()];

export interface AttractionManager {
  provider: string;
  search(data: AttractionRequest): Promise<Attraction[]>;
}

export async function searchAttractions(
  data: AttractionRequest,
): Promise<Attraction[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}
