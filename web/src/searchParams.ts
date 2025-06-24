import { z } from "zod";

export const contestSecretSearchParamsSchema = z.object({
  secret: z.string({
    required_error: "Missing secret",
  }),
});

export const rewardDrawSearchParamsSchema = z.object({
  submissionId: z.string().optional(),
});
