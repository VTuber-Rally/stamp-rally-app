import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  SellCardsFunctionRequest,
  SellCardsFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/sellCards.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { functions } from "@/lib/appwrite.ts";
import { sellCardsFunctionId } from "@/lib/consts.ts";

export const useSellCards = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: SellCardsFunctionRequest) => {
      const result = await functions.createExecution(
        sellCardsFunctionId,
        JSON.stringify(request satisfies SellCardsFunctionRequest),
      );

      const data = JSON.parse(result.responseBody) as SellCardsFunctionResponse;

      if (data.status === "error") {
        throw new Error(data.message);
      }

      console.log(data);

      return data;
    },
    onSuccess: () => {
      // Invalidate the query to force a reload
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.AVAILABLE_CARDS],
      });
    },
  });
};
