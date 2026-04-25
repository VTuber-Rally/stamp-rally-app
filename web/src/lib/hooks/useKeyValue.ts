import { useQuery } from "convex/react";

import type { KeyValueEntry } from "@vtube-stamp-rally/shared-lib/models/KeyValue.ts";

import { convexPublicApi } from "@/lib/convex.ts";

export const useKeyValue = <T>(keyValueEntry: KeyValueEntry<T>) => {
  const rawValue = useQuery(convexPublicApi.flags.getFlag, {
    key: keyValueEntry.key,
  });
  if (typeof rawValue === "string") {
    return keyValueEntry.transform(rawValue);
  }
  return undefined;
};
