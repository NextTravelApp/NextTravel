import { readFileSync } from "node:fs";
import type { AttractionManager } from "../../attractions";
import type { Attraction } from "../../types";

export class LocalData implements AttractionManager {
  provider = "local";

  async search(): Promise<Attraction[]> {
    return (
      JSON.parse(
        readFileSync("local/attractions.json", "utf-8"),
      ) as Attraction[]
    ).map((att) => ({
      ...att,
      id: `${this.provider}_${att.id}`,
    }));
  }

  async get(id: string): Promise<Attraction | undefined> {
    const item = await this.search().then((data) =>
      data.find((item) => `${this.provider}_${id}` === item.id),
    );

    if (!item) return undefined;

    return {
      ...item,
      id: `${this.provider}_${item.id}`,
    };
  }
}
