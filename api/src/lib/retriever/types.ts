export type Attraction = {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  rating: number;
  checkoutUrl?: string;
};

export enum AccomodationType {
  HOTEL = "hotel",
  BNB = "bnb",
  FLAT = "flat",
}

export type Accomodation = {
  id: string;
  name: string;
  location: string;
  image: string;
  price: number;
  type: AccomodationType;
  rating: number;
  checkoutUrl?: string;
};
