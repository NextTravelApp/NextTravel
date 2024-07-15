import type { AttractionRequest } from "../ai/tools";
import { LocalData, WeGoTrip } from "./implementations/attractions";
import type { Attraction } from "./types";

export const managers: AttractionManager[] = [new WeGoTrip()];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface AttractionManager {
  provider: string;
  search(data: AttractionRequest): Promise<Attraction[]>;
  get(id: string): Promise<Attraction | undefined>;
}

export async function searchAttractions(
  data: AttractionRequest,
): Promise<Attraction[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}

export async function getAttraction(
  id: string,
): Promise<Attraction | undefined> {
  const manager = managers.find(
    (manager) => manager.provider === id.split("_")[0],
  );
  if (!manager) return undefined;

  return manager.get(id.split(`${manager.provider}_`)[1]);
}
