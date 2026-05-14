import { Prize } from "@/lib/convex.ts";

export type RewardDrawType = Prize["draw"];

export function isRewardDrawType(type: string): type is RewardDrawType {
  return ["standard", "premium"].includes(type);
}
