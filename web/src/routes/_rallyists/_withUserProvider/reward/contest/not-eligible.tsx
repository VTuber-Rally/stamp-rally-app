import { createFileRoute } from "@tanstack/react-router";

import { NotEligiblePage } from "@/components/routes/rallyists/contest/NotEligiblePage";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/not-eligible",
)({
  component: NotEligiblePage,
});
