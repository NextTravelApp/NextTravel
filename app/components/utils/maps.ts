import type { ClientType } from "../fetcher";

export async function reverseGeocode(
  fetcher: ClientType,
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const res = await fetcher.geo.reverse.$get({
    query: { latitude: latitude.toString(), longitude: longitude.toString() },
  });

  const data = await res.json();

  if (typeof data !== "string") return null;

  return data;
}
