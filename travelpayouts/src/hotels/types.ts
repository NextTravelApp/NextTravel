export type BaseResponse = {
  status: "ok";
};

export type Location = {
  lat: string;
  lon: string;
};

export type SearchResponse = {
  results: {
    locations: LocationResult[];
    hotels: SimpleHotelResult[];
  };
} & BaseResponse;

export type LocationResult = {
  cityName: string;
  hotelsCount: string;
  _score: number;
  fullName: string;
  countryCode: string;
  countryName: string;
  iata: string[];
  id: string;
  location: Location;
};

export type SimpleHotelResult = {
  id: string;
  location: Location;
  _score: string;
  locationName: string;
  locationId: string;
  fullName: string;
  label: string;
};

export type HotelsResponse = {
  result: HotelResult[];
} & BaseResponse;

export type HotelResult = {
  fullUrl: string;
  maxPricePerNight: number;
  maxPrice: number;
  photoCount: number;
  guestScore: number;
  address: string;
  minPriceTotal: number;
  id: number;
  price: number;
  name: string;
  url: string;
  popularity: number;
  location: Location;
  stars: number;
  distance: number;
  rooms: HotelRoom[];
  rating: number;
};

export type HotelRoom = {
  bookingURL: string;
  options: {
    available: number;
    deposit: boolean;
    refundable: boolean;
    breakfast: boolean;
  };
  tax: number;
  desc: string;
  fullBookingURL: string;
  agencyName: string;
  agencyId: string;
  total: number;
  price: number;
  internalTypeId: number;
};
