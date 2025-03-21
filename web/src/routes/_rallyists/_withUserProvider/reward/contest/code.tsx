import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { CodePage } from "@/components/routes/rallyists/contest/CodePage";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/code",
)({
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
  component: CodePage,
});
