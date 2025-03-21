import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import { ContactPage } from "@/components/routes/rallyists/contest/ContactPage";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/contact",
)({
  component: ContactPage,
  validateSearch: (search) => {
    return z
      .object({
        secret: z.string(),
      })
      .parse(search);
  },
});
