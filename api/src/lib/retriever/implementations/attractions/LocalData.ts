import { readFileSync } from "node:fs";
import type { AttractionManager } from "../../attractions";
import type { Attraction } from "../../types";

export class LocalData implements AttractionManager {
  provider = "local";

  async search(): Promise<Attraction[]> {
    return JSON.parse(readFileSync("local/attractions.json", "utf-8"));
  }

  async get(id: string): Promise<Attraction | undefined> {
    return this.search().then((data) => data.find((item) => item.id === id));
  }
}
