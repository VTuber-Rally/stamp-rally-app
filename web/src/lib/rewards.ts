export type RewardDrawType = "standard" | "premium";

export function isRewardDrawType(type: string): type is RewardDrawType {
  return ["standard", "premium"].includes(type);
}

export type Prize = {
  draw: RewardDrawType;
  probability: number;
  classicCards: number;
  holographicCards: number;
};
