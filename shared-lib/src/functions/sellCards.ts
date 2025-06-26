import { z } from "zod";

export const SellCardsFunctionRequestValidator = z.object({
  submissionId: z.string().optional(),
  orderedCards: z.array(
    z.object({
      cardDesignId: z.string(),
      type: z.enum(["classic", "holo"]),
      quantity: z.number().int().positive(),
    }),
  ),
});

export type SellCardsFunctionRequest = z.infer<
  typeof SellCardsFunctionRequestValidator
>;

export type SellCardsFunctionResponse =
  | {
      status: "success";
      soldCards: number;
    }
  | {
      status: "error";
      message: string;
      error: string;
    };
