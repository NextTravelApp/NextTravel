import { readFileSync } from "node:fs";
import type { TransportManager } from "../../transports";
import type { Transport } from "../../types";

export class LocalData implements TransportManager {
  provider = "local";

  async search(): Promise<Transport[]> {
    return JSON.parse(readFileSync("local/transports.json", "utf-8"));
  }
}
