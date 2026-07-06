import { ConvexId, convexPublicApi, useDLEQuery } from "@/lib/convex.ts";

export const useCardDesigns = () =>
  useDLEQuery({
    query: convexPublicApi.cards.listCardDesigns,
    args: {},
  });

export const useCardDesignById = (id?: ConvexId<"cardDesigns">) => {
  const cardDesigns = useCardDesigns();

  if (cardDesigns.status === "pending") {
    return { status: "pending" } as const;
  }

  if (cardDesigns.status === "error") {
    return { status: "error" } as const;
  }

  return {
    status: "success",
    data: cardDesigns.data.find((cardDesign) => cardDesign._id === id),
  } as const;
};
