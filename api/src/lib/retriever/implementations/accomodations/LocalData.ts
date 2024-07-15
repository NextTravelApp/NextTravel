import { readFileSync } from "node:fs";
import type { AccomodationManager } from "../../accomodations";
import type { Accomodation } from "../../types";

export class LocalData implements AccomodationManager {
  provider = "local";

  async search(): Promise<Accomodation[]> {
    return (
      JSON.parse(
        readFileSync("local/accomodations.json", "utf-8"),
      ) as Accomodation[]
    ).map((acc) => ({
      ...acc,
      id: `${this.provider}_${acc.id}`,
    }));
  }

  async get(id: string): Promise<Accomodation | undefined> {
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
