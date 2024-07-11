export function useClientOnlyValue<S, C>(_server: S, client: C): S | C {
  return client;
}
