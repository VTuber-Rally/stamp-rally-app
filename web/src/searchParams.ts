import { z } from "zod";

export const contestSecretSearchParamsSchema = z.object({
  secret: z.string({
    required_error: "Missing secret",
  }),
});
