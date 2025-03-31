import { z } from "zod";

export const searchParamsValidator = (search: Record<string, string>) => {
  return z
    .object(
      {
        secret: z.string(),
      },
      {
        required_error: "Missing secret",
      },
    )
    .parse(search);
};
