import { createFileRoute } from "@tanstack/react-router";

import { ContestPage } from "@/components/routes/rallyists/contest/ContestPage";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/",
)({
  component: ContestPage,
});
