import { formatDate } from "date-fns";
import md5 from "md5";
import { axiosClient } from "../utils/fetcher";
import type { HotelsResponse, HotelsSearchResponse } from "./types";

function generateSignature(params: URLSearchParams) {
  const keys = Array.from(params.keys()).sort();
  const values = keys.map((key) => params.get(key)).join(":");
  const data = `${process.env.HOTELLOOK_TOKEN}:${process.env.HOTELLOOK_PARTNER}:${values}`;

  return md5(data);
}

export const findHotelsOrLocation = async (
  query: string,
  lookFor: "hotel" | "city",
) => {
  const params = new URLSearchParams();
  params.append("query", query);
  params.append("lookFor", lookFor);
  params.append("token", process.env.HOTELLOOK_TOKEN ?? "");

  const url = `https://engine.hotellook.com/api/v2/lookup.json?${params}`;
  return axiosClient
    .get<HotelsSearchResponse>(url)
    .then((res) => res.data)
    .then((data) => data.results);
};

export const getHotels = async (
  id: string,
  checkIn: Date,
  checkOut: Date,
  adultsCount: number,
  childrens?: number[],
) => {
  let params = new URLSearchParams();
  params.append("cityId", id);
  params.append("checkIn", formatDate(checkIn, "yyyy-MM-dd"));
  params.append("checkOut", formatDate(checkOut, "yyyy-MM-dd"));
  params.append("adultsCount", adultsCount.toString());
  params.append("currency", "EUR");
  params.append("waitForResult", "1");

  if (childrens) {
    if (childrens.length > 3) throw new Error("Maximum children count is 3");

    params.append("childrenCount", childrens.length.toString());
    childrens.forEach((age, index) => {
      if (age < 0 || age > 17)
        throw new Error(`Child(${index}) age must be between 0 and 17`);

      params.append(`childAge${index + 1}`, age.toString());
    });
  }

  params.append("signature", generateSignature(params));
  params.append("marker", process.env.HOTELLOOK_PARTNER ?? "");

  let url = `https://engine.hotellook.com/api/v2/search/start.json?${params.toString()}`;
  const { data } = await axiosClient.get(url);

  if (!("searchId" in data))
    throw new Error("Failed to get searchId from the response");

  params = new URLSearchParams();
  params.append("searchId", data.searchId);
  params.append("limit", "20");
  params.append("signature", generateSignature(params));
  params.append("marker", process.env.HOTELLOOK_PARTNER ?? "");

  url = `https://engine.hotellook.com/api/v2/search/getResult.json?${params.toString()}`;
  return axiosClient
    .get<HotelsResponse>(url)
    .then((res) => res.data)
    .then((data) => data.result);
};

export type * from "./types";
