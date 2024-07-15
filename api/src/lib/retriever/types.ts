export type Attraction = {
  id: string;
  name: string;
  location: string;
  price: number;
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
};
