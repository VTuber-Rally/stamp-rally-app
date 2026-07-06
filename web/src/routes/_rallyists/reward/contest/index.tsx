import { createFileRoute } from "@tanstack/react-router";

import { ContestPage } from "@/components/routes/rallyists/contest/ContestPage";

export const Route = createFileRoute("/_rallyists/reward/contest/")({
  component: ContestPage,
});
