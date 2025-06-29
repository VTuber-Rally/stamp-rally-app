import { useQuery } from "@tanstack/react-query";

import { CardDesign } from "@vtube-stamp-rally/shared-lib/models/Inventory.ts";

import { QUERY_KEYS } from "@/lib/QueryKeys";
import { databases } from "@/lib/appwrite";
import { cardDesignsCollectionId, databaseId } from "@/lib/consts";
import { getCardDesignImagePreview } from "@/lib/images";
import { queryClient } from "@/lib/queryClient";

const getCardDesignsList = async () => {
  return databases
    .listDocuments<CardDesign>(databaseId, cardDesignsCollectionId)
    .then((res) =>
      res.documents.map((doc) => ({
        ...doc,
        image: getCardDesignImagePreview(doc.image, 256, 384),
      })),
    );
};

const CardDesignsQuery = {
  queryKey: [QUERY_KEYS.CARD_DESIGNS],
  staleTime: Infinity,
  queryFn: getCardDesignsList,
};

export const prefetchCardDesigns = () =>
  queryClient.prefetchQuery(CardDesignsQuery);

const getCardDesigns = () => queryClient.ensureQueryData(CardDesignsQuery);

export const useCardDesigns = () => {
  const {
    data: cardDesigns,
    isLoading,
    error,
  } = useQuery({
    queryKey: [QUERY_KEYS.CARD_DESIGNS],
    queryFn: getCardDesigns,
  });

  return { cardDesigns, isLoading, error };
};

export const useCardDesignByStandistId = (standistId: string) => {
  const { cardDesigns } = useCardDesigns();

  if (!cardDesigns) {
    return undefined;
  }

  return cardDesigns.find((design) => design.standist?.userId === standistId);
};
