import type { AccomodationsRequest } from "../ai/tools";
import { HotelLook } from "./implementations/accomodations";
import type { Accomodation } from "./types";

export const managers: AccomodationManager[] = [new HotelLook()];

export interface AccomodationManager {
  provider: string;
  search(data: AccomodationsRequest): Promise<Accomodation[]>;
}

export async function searchAccomodations(
  data: AccomodationsRequest,
): Promise<Accomodation[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}
