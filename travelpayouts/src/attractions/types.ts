export type AttractionsSearchResponse = {
  data: {
    results: AttractionsSearchResult[];
  };
};

export type AttractionsSearchResult = {
  id: number;
  name: string;
  slug: string;
  preview: string;
  available: boolean;
  country: {
    id: number;
    name: string;
    slug: string;
  };
  city?: {
    id: number;
    name: string;
    slug: string;
  };
  type: "city" | "attraction";
};

export type AttractionsProductsResponse = {
  data: {
    results: AttractionsProductResult[];
  };
};

export type AttractionsProductResponse = {
  data?: AttractionsProductResult;
};

export type AttractionsProductResult = {
  id: number;
  title: string;
  slug: string;
  cover: string;
  preview: string;
  price: number;
  exprice: number;
  currency: string;
  currencyCode: string;
  rating: number;
  reviewsCount: number;
  ratingsCount: number;
  category: string;
  city: {
    id: number;
    name: string;
    slug: string;
  };
  duration: string;
  durationMin: number;
  durationMax: number;
  type: number;
  tags: {
    audioguide: boolean;
    available: boolean;
  };
  locale: string;
};
