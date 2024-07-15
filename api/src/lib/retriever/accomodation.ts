import type { AccomodationsRequest } from "../ai/tools";
import { HotelLook, LocalData } from "./implementations/accomodations";
import type { Accomodation } from "./types";

export const managers: AccomodationManager[] = [new HotelLook()];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface AccomodationManager {
  provider: string;
  search(data: AccomodationsRequest): Promise<Accomodation[]>;
  get(
    id: string,
    data: AccomodationsRequest,
  ): Promise<Accomodation | undefined>;
}

export async function searchAccomodations(
  data: AccomodationsRequest,
): Promise<Accomodation[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}
