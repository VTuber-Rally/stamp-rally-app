import { useMutation } from "convex/react";

import { convexPublicApi, useDLEMutation } from "@/lib/convex.ts";

export const useSellCards = () =>
  useDLEMutation(useMutation(convexPublicApi.cards.sellCards));
