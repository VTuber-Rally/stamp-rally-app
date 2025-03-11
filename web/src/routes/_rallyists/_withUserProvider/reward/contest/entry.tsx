import { createFileRoute } from "@tanstack/react-router";

import { EntryPage } from "@/components/routes/rallyists/contest/EntryPage";
import { searchParamsValidator } from "@/lib/contest";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/entry",
)({
  validateSearch: searchParamsValidator,
  component: EntryPage,
});
