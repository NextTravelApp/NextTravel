import { findTrips, getTrips } from "travelpayouts";
import type { AttractionRequest } from "../../../ai/tools";
import type { AttractionManager } from "../../attractions";
import type { Attraction } from "../../types";

export class WeGoTrip implements AttractionManager {
  provider = "wegotrip";

  async search(data: AttractionRequest): Promise<Attraction[]> {
    const locations = await findTrips(data.name);
    if (!locations.length) return [];

    const location = locations[0];
    const trips = await getTrips(location.id);

    return trips.map((trip) => ({
      id: `${this.provider}_${trip.id}`,
      name: trip.title,
      location: trip.city.name,
      price: trip.price,
    }));
  }
}
