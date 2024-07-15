import type { TransportRequest } from "../ai/tools";
import { LocalData } from "./implementations/transports";
import type { Transport } from "./types";

export const managers: TransportManager[] = [];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface TransportManager {
  provider: string;
  search(data: TransportRequest): Promise<Transport[]>;
  get(id: string): Promise<Transport | undefined>;
}

export async function searchTransports(
  data: TransportRequest,
): Promise<Transport[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}

export async function getTransport(id: string): Promise<Transport | undefined> {
  const manager = managers.find(
    (manager) => manager.provider === id.split("_")[0],
  );
  if (!manager) return undefined;

  return manager.get(id.split(`${manager.provider}_`)[1]);
}
