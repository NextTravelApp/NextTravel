import type { TransportRequest } from "../ai/tools";
import { LocalData } from "./implementations/transports";
import type { Transport } from "./types";

export const managers: TransportManager[] = [];
if (process.env.RETURN_EXAMPLE_DATA) managers.push(new LocalData());

export interface TransportManager {
  provider: string;
  search(data: TransportRequest): Promise<Transport[]>;
}

export async function searchTransports(
  data: TransportRequest,
): Promise<Transport[]> {
  const results = await Promise.all(
    managers.map((manager) => manager.search(data)),
  );

  return results.flat();
}
