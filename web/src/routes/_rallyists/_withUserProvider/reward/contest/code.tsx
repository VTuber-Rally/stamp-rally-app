import { createFileRoute } from "@tanstack/react-router";

import { CodePage } from "@/components/routes/rallyists/contest/CodePage";
import { searchParamsValidator } from "@/lib/contest";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/code",
)({
  validateSearch: searchParamsValidator,
  component: CodePage,
});
