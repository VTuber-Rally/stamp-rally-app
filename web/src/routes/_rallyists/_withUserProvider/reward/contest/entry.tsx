import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { EntryPage } from "@/components/routes/rallyists/contest/EntryPage";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/entry",
)({
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
  component: EntryPage,
});
