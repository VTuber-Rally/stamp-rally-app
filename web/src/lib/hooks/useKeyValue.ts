import { useQuery } from "convex/react";

import type { KeyValueEntry } from "@/lib/KeyValues.ts";
import { convexPublicApi } from "@/lib/convex.ts";

export const useKeyValue = <T>(keyValueEntry: KeyValueEntry<T>) => {
  const rawValue = useQuery(
    keyValueEntry.public
      ? convexPublicApi.flags.getFlag
      : convexPublicApi.flags.getPrivateFlag,
    {
      key: keyValueEntry.key,
    },
  );
  if (typeof rawValue === "string") {
    return keyValueEntry.transform(rawValue);
  }
  return rawValue;
};
