import { readFileSync } from "node:fs";
import type { TransportManager } from "../../transports";
import type { Transport } from "../../types";

export class LocalData implements TransportManager {
  provider = "local";

  async search(): Promise<Transport[]> {
    return (
      JSON.parse(readFileSync("local/transports.json", "utf-8")) as Transport[]
    ).map((tra) => ({
      ...tra,
      id: `${this.provider}_${tra.id}`,
    }));
  }

  async get(id: string): Promise<Transport | undefined> {
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