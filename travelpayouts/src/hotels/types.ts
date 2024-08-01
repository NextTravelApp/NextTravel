export type HotelsLocation = {
  lat: string;
  lon: string;
};

export type HotelsSearchResponse = {
  results: {
    locations: HotelsLocationResult[];
    hotels: SimpleHotelResult[];
  };
};

export type HotelsLocationResult = {
  cityName: string;
  hotelsCount: string;
  _score: number;
  fullName: string;
  countryCode: string;
  countryName: string;
  iata: string[];
  id: number;
  location: HotelsLocation;
};

export type SimpleHotelResult = {
  id: number;
  location: HotelsLocation;
  _score: string;
  locationName: string;
  locationId: string;
  fullName: string;
  label: string;
};

export type HotelsResponse = {
  result: HotelResult[];
};

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
  location: HotelsLocation;
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

export type HotelImages = {
  [hotelId: string]: number[];
};
