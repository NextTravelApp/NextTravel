import { useEffect, useState } from "react";

export function useClientOnlyValue<S, C>(server: S, client: C): S | C {
  const [value, setValue] = useState<S | C>(server);
  useEffect(() => {
    setValue(client);
  }, [client]);

  return value;
}
