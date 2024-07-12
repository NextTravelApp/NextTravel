import type { TransportRequest } from "../ai/tools";
import {} from "./implementations/transports";
import type { Transport } from "./types";

export const managers: TransportManager[] = [];

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
