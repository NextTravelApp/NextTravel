import type { AttractionsRequest } from "../ai/tools";
import { LocalData, WeGoTrip } from "./implementations/attractions";
import type { Attraction } from "./types";

export const managers: AttractionManager[] = [new WeGoTrip()];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface AttractionManager {
  provider: string;
  search(data: AttractionsRequest): Promise<Attraction[]>;
  get(id: string): Promise<Attraction | undefined>;
}

export async function searchAttractions(
  data: AttractionsRequest,
): Promise<Attraction[]> {
  const results = await Promise.all(
    managers.map(async (manager) => {
      try {
        return await manager.search(data);
        // biome-ignore lint/suspicious/noExplicitAny: Errors cannot have type here
      } catch (error: any) {
        console.log(
          `[Retriever] [Attractions] Manager ${manager.provider} returned an error:`,
          "message" in error ? error.message : "Unknown error",
        );

        return [];
      }
    }),
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
