import type { AttractionRequest } from "../ai/tools";
import { LocalData, WeGoTrip } from "./implementations/attractions";
import type { Attraction } from "./types";

export const managers: AttractionManager[] = [new WeGoTrip()];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

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
