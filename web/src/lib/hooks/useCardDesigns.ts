import { useQuery } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { useDatabase } from "@/lib/hooks/useDatabase.ts";

export const useCardDesigns = () => {
  const { getCardDesigns } = useDatabase();

  return useQuery({
    queryKey: [QUERY_KEYS.CARD_DESIGNS],
    queryFn: () => getCardDesigns(),
  });
};

export const useCardDesignsPreview = (width: number, height: number) => {
  const { getCardDesignsPreview } = useDatabase();

  return useQuery({
    queryKey: [QUERY_KEYS.CARD_DESIGNS, "preview", width, height],
    queryFn: () => getCardDesignsPreview(width, height),
  });
};
