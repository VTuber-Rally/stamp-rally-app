import { useQuery } from "@tanstack/react-query";

import { db } from "@/lib/db.ts";

import { QUERY_KEYS } from "../QueryKeys.ts";

export const useCollectedStamps = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.STAMPS],
    queryFn: async () =>
      await db.stamps
        .toArray()
        .then((stamps) => stamps.filter((stamp) => !stamp.submitted)),
    networkMode: "always",
  });

  return { isLoading, error, data };
};
