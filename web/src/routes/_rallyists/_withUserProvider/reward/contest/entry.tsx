import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { EntryPage } from "@/components/routes/rallyists/contest/EntryPage";
import { contestSecretSearchParamsSchema } from "@/searchParams.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/entry",
)({
  validateSearch: zodValidator(contestSecretSearchParamsSchema),
  component: EntryPage,
});
