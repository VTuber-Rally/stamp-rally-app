import { convexPublicApi, useDLEQuery } from "@/lib/convex.ts";

export const useAvailableCards = () =>
  useDLEQuery({
    query: convexPublicApi.cards.listAvailableCards,
    args: {},
  });
