import { skipToken, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "../QueryKeys.ts";
import { useUser } from "@/lib/hooks/useUser.ts";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";

export const useRallySubmissions = () => {
  const { user } = useUser();
  const { getOwnSubmissions } = useDatabase();

  const { isLoading, error, data } = useQuery({
    queryKey: [QUERY_KEYS.SUBMISSIONS],
    refetchInterval: 1000 * 30, // toutes les 30 secondes
    refetchIntervalInBackground: true,
    queryFn: user ? () => getOwnSubmissions(user.$id) : skipToken,
    networkMode: "always",
  });

  return { isLoading, error, data };
};
