import { useQuery } from "@tanstack/react-query";

import {
  GetAvailableCardsFunctionRequest,
  GetAvailableCardsFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/getAvailableCards.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { functions } from "@/lib/appwrite.ts";
import { getAvailableCardsFunctionId } from "@/lib/consts.ts";

export const useAvailableCards = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AVAILABLE_CARDS],
    queryFn: async () => {
      const result = await functions.createExecution(
        getAvailableCardsFunctionId,
        JSON.stringify({} satisfies GetAvailableCardsFunctionRequest),
      );

      const data = JSON.parse(
        result.responseBody,
      ) as GetAvailableCardsFunctionResponse;

      if (data.status === "error") {
        throw new Error(data.message);
      }

      return data;
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60, // au cas où, refresh chaque minute
  });
};
