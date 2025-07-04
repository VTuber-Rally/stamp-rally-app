import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  GetAvailableCardsFunctionRequest,
  GetAvailableCardsFunctionResponse,
} from "@vtube-stamp-rally/shared-lib/functions/getAvailableCards.ts";
import {
  Card,
  CardAvailable,
} from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { client, functions } from "@/lib/appwrite.ts";
import {
  cardsCollectionId,
  databaseId,
  getAvailableCardsFunctionId,
} from "@/lib/consts.ts";
import { getCardDesignImagePreview } from "@/lib/images.ts";

export const useAvailableCards = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsubscribe = client.subscribe<Card>(
      `databases.${databaseId}.collections.${cardsCollectionId}.documents`,
      (response) => {
        // we subscribe to the events of creation, update and deletion of cards
        // so we invalidate to force the refresh of the available cards
        console.log("Received subscription event:", response);
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.update",
          ) ||
          response.events.includes(
            "databases.*.collections.*.documents.*.delete",
          )
        ) {
          // Invalidate the query to force a reload
          queryClient.invalidateQueries({
            queryKey: [QUERY_KEYS.AVAILABLE_CARDS],
          });
        }
      },
    );

    return () => {
      unsubscribe();
    };
  }, [queryClient]);

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

      return {
        ...data,
        cards: data.cards
          .map(
            (card) =>
              ({
                ...card,
                // On ajoute l'URL de l'image pour chaque carte
                image: getCardDesignImagePreview(card.image, 128, 192),
              }) as CardAvailable,
          )
          .sort((a, b) => a.name.localeCompare(b.name)),
      };
    },
    staleTime: 1000 * 60 * 5,
    refetchInterval: 1000 * 60, // au cas où, refresh chaque minute
  });
};
