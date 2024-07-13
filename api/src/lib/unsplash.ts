import { createApi } from "unsplash-js";

const unsplash = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY as string,
});

export async function getImage(location: string) {
  const { response: photos } = await unsplash.search.getPhotos({
    query: location,
    perPage: 1,
    plus: "none",
  });

  if (!photos) return null;

  return {
    url: photos.results[0].urls.small,
    author: photos.results[0].user.links.html,
  };
}
