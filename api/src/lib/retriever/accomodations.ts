import { AxiosError } from "axios";
import type { AccomodationsRequest } from "../ai/tools";
import { HotelLook, LocalData } from "./implementations/accomodations";
import type { Accomodation } from "./types";

export const managers: AccomodationManager[] = [new HotelLook()];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface AccomodationManager {
  provider: string;
  search(data: AccomodationsRequest, limit?: number): Promise<Accomodation[]>;
  get(
    id: string,
    data: AccomodationsRequest | null,
  ): Promise<Accomodation | undefined>;
}

export async function searchAccomodations(
  data: AccomodationsRequest,
  limit?: number,
): Promise<Accomodation[]> {
  const results = await Promise.all(
    managers.map(async (manager) => {
      try {
        return await manager.search(data, limit);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.log(
            `[Retriever] [Accomodations] Manager ${manager.provider} returned an error:`,
            "message" in error ? error.message : "Unknown error",
          );

          if (process.env.NODE_ENV !== "production")
            console.log(error?.response?.data);
        }
        return [];
      }
    }),
  );

  return results.flat();
}

export async function getAccomodation(
  id: string,
  data: AccomodationsRequest | null,
): Promise<Accomodation | undefined> {
  const manager = managers.find(
    (manager) => manager.provider === id.split("_")[0],
  );
  if (!manager) return undefined;

  return manager.get(id.split(`${manager.provider}_`)[1], data);
}
