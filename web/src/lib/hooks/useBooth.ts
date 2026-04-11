import { Id } from "~/_generated/dataModel.js";

import { useBooths } from "@/lib/hooks/useBooths.ts";

export const useBooth = (boothId?: Id<"booths">) => {
  const booths = useBooths();
  return booths.data?.find((booth) => booth._id === boothId);
};
