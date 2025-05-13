import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { CodePage } from "@/components/routes/rallyists/contest/CodePage";
import { contestSecretSearchParamsSchema } from "@/searchParams.ts";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/code",
)({
  validateSearch: zodValidator(contestSecretSearchParamsSchema),
  component: CodePage,
});
