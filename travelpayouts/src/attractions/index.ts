import { axiosClient } from "../utils/fetcher";
import type {
  AttractionsProductResponse,
  AttractionsProductsResponse,
  AttractionsSearchResponse,
} from "./types";

export const findTrips = async (query: string) => {
  const params = new URLSearchParams();
  params.append("query", query);

  const url = `https://app.wegotrip.com/api/v2/search/?${params}`;
  return axiosClient
    .get<AttractionsSearchResponse>(url)
    .then((res) => res.data.data.results);
};

export const getTrips = async (cityId: number) => {
  const params = new URLSearchParams();
  params.append("currency", "EUR");
  params.append("city", cityId.toString());

  const url = `https://app.wegotrip.com/api/v2/products/popular/?${params.toString()}`;
  return axiosClient
    .get<AttractionsProductsResponse>(url)
    .then((res) => res.data.data.results);
};

export const getTrip = async (id: number) => {
  const params = new URLSearchParams();
  params.append("currency", "EUR");

  const url = `https://app.wegotrip.com/api/v2/products/${id}/?${params.toString()}`;
  return axiosClient
    .get<AttractionsProductResponse>(url)
    .then((res) => res.data.data);
};

export const getTripCheckoutLink = async (id: number) => {
  const item = await getTrip(id);
  if (!item) return undefined;

  return `https://wegotrip.com/checkout/${item.slug}-p${item.id}/booking/?sub_id=${process.env.WEGOTRIP_PARTNER}`;
};

export type * from "./types";
