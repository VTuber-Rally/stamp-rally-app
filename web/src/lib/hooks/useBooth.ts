import { ConvexId } from "@/lib/convex.ts";
import { useBooths } from "@/lib/hooks/useBooths.ts";

export const useBooth = (boothId?: ConvexId<"booths">) => {
  const booths = useBooths();
  return booths.data?.find((booth) => booth._id === boothId);
};
