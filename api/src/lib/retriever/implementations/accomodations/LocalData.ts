import { readFileSync } from "node:fs";
import type { AccomodationManager } from "../../accomodation";
import type { Accomodation } from "../../types";

export class LocalData implements AccomodationManager {
  provider = "local";

  async search(): Promise<Accomodation[]> {
    return JSON.parse(readFileSync("local/accomodations.json", "utf-8"));
  }

  async get(id: string): Promise<Accomodation | undefined> {
    return this.search().then((data) => data.find((item) => item.id === id));
  }
}
