import { formatDate } from "date-fns";
import md5 from "md5";
import { axiosClient } from "../utils/fetcher";
import type {
  HotelImages,
  HotelsResponse,
  HotelsSearchResponse,
} from "./types";

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
  id: {
    type: "cityId" | "hotelId";
    value: string | number;
  },
  checkIn: Date,
  checkOut: Date,
  adultsCount: number,
  childrens: number[],
  limit?: number,
) => {
  const params = new URLSearchParams();
  params.append(id.type, id.value.toString());
  params.append("checkIn", formatDate(checkIn, "yyyy-MM-dd"));
  params.append("checkOut", formatDate(checkOut, "yyyy-MM-dd"));
  params.append("adultsCount", adultsCount.toString());
  params.append("currency", "EUR");
  params.append("limit", limit?.toString() || "25");
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

  const url = `https://engine.hotellook.com/api/v2/search/start.json?${params.toString()}`;
  const data = await axiosClient
    .get<HotelsResponse>(url)
    .then((res) => res.data)
    .then((data) => data.result);

  const images = await getHotelsImage(data.map((hotel) => hotel.id));
  return data.map((hotel) => {
    const image = images[hotel.id];

    return {
      ...hotel,
      image: formatImage(image[0]),
    };
  });
};

export const getHotelsImage = async (id: number[]) => {
  const url = `https://yasen.hotellook.com/photos/hotel_photos?id=${id.join(",")}`;
  return axiosClient.get<HotelImages>(url).then((res) => res.data);
};

export const formatImage = (id: number) => {
  return `https://photo.hotellook.com/image_v2/limit/${id}/200/150.jpg`;
};

export type * from "./types";
