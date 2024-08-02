import {
  findHotelsOrLocation,
  formatImage,
  getHotels,
  getHotelsImage,
} from "travelpayouts";
import type { AccomodationsRequest } from "../../../ai/tools";
import type { AccomodationManager } from "../../accomodations";
import { type Accomodation, AccomodationType } from "../../types";

export class HotelLook implements AccomodationManager {
  provider = "hotellook";

  async search(
    data: AccomodationsRequest,
    limit?: number,
  ): Promise<Accomodation[]> {
    const { locations } = await findHotelsOrLocation(data.location, "city");
    if (!locations.length) return [];

    const location = locations[0];
    const hotels = await getHotels(
      {
        type: "cityId",
        value: location.id,
      },
      new Date(data.checkIn),
      new Date(data.checkOut),
      data.members.filter((age) => age >= 18).length,
      data.members.filter((age) => age < 18),
      limit,
    );

    return hotels.map((hotel) => ({
      id: `${this.provider}_${hotel.id}`,
      name: hotel.name,
      location: hotel.address,
      price: hotel.minPriceTotal,
      image: hotel.image,
      type: AccomodationType.HOTEL,
      rating: hotel.stars,
    }));
  }

  async get(
    id: string,
    data: AccomodationsRequest | null,
  ): Promise<Accomodation | undefined> {
    if (data) {
      const hotels = await getHotels(
        {
          type: "hotelId",
          value: id,
        },
        new Date(data.checkIn),
        new Date(data.checkOut),
        data.members.filter((age) => age >= 18).length,
        data.members.filter((age) => age < 18),
        1,
      );

      const hotel = hotels[0];

      return {
        id: `${this.provider}_${hotel.id}`,
        name: hotel.name,
        location: hotel.address,
        price: hotel.minPriceTotal,
        image: hotel.image,
        type: AccomodationType.HOTEL,
        rating: hotel.stars,
        checkoutUrl: hotel.rooms[0].fullBookingURL,
      };
    }

    const { hotels } = await findHotelsOrLocation(id, "hotel");
    if (!hotels.length) return undefined;

    const hotel = hotels[0];
    const image = await getHotelsImage([hotel.id]);

    return {
      id: `${this.provider}_${hotel.id}`,
      name: hotel.label,
      location: hotel.locationName,
      price: 0,
      image: formatImage(image[hotel.id][0]),
      type: AccomodationType.HOTEL,
      rating: 0,
    };
  }
}
