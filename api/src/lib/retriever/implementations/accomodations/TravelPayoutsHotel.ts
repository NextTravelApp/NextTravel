import type { AccomodationsRequest } from "@/lib/ai/tools";
import type { AccomodationManager } from "@/lib/retriever/accomodation";
import { type Accomodation, AccomodationType } from "@/lib/retriever/types";
import { findLocation, getHotels } from "travelpayouts";

export class TravelPayoutsHotel implements AccomodationManager {
  provider = "travelpayouts_hotel";

  async search(data: AccomodationsRequest): Promise<Accomodation[]> {
    const locations = await findLocation(data.location);
    if (!locations.length) return [];

    const location = locations[0];
    const hotels = await getHotels(
      location.id,
      new Date(data.checkIn),
      new Date(data.checkOut),
      data.members.filter((age) => age >= 18).length,
      data.members.filter((age) => age < 18),
    );

    return hotels.map((hotel) => ({
      id: `${this.provider}_${hotel.id}`,
      name: hotel.name,
      location: hotel.address,
      price: hotel.minPriceTotal,
      type: AccomodationType.HOTEL,
      rating: hotel.stars,
    }));
  }
}
