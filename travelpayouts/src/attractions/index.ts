import { axiosClient } from "../utils/fetcher";
import type { ProductsResponse, SearchResponse } from "./types";

export const find = async (query: string) => {
  const params = new URLSearchParams();
  params.append("query", query);

  const url = `https://app.wegotrip.com/api/v2/search/?${params}`;
  return axiosClient
    .get<SearchResponse>(url)
    .then((res) => res.data)
    .then((data) =>
      data.data.results.filter((result) => result.type === "city"),
    );
};

export const findProduct = async (attractionId: number) => {
  const params = new URLSearchParams();
  params.append("currency", "EUR");
  params.append("attraction", attractionId.toString());

  const url = `https://app.wegotrip.com/api/v2/products/popular/?${params.toString()}`;
  return axiosClient
    .get<ProductsResponse>(url)
    .then((res) => res.data)
    .then((data) => data.data.results);
};

export type * from "./types";
