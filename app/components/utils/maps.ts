import type { ClientType } from "../fetcher";

export async function reverseGeocode(
  fetcher: ClientType,
  latitude: number,
  longitude: number,
): Promise<string | null> {
  const data = fetcher.geo.reverse
    .$get({
      query: { latitude: latitude.toString(), longitude: longitude.toString() },
    })
    .then((res) => res.json());

  return data;
}
