import { useQuery } from "@tanstack/react-query";
import { type KeyValueEntry } from "shared-lib";

import { QUERY_KEYS } from "../QueryKeys";
import { useDatabase } from "./useDatabase";

export const useKeyValue = <T>(keyValueEntry: KeyValueEntry<T>) => {
  const { getKeyValue } = useDatabase();

  const { data: value, isPending } = useQuery({
    queryKey: [QUERY_KEYS.KV, keyValueEntry.key],
    queryFn: () =>
      getKeyValue(keyValueEntry.key).then((data) =>
        keyValueEntry.transform(data.value),
      ),
    staleTime: Infinity,
  });

  return { value: value as T | undefined, isPending };
};
