import { createFileRoute } from "@tanstack/react-router";

import { SuccessPage } from "@/components/routes/rallyists/contest/SuccessPage";

export const Route = createFileRoute("/_rallyists/reward/contest/success")({
  component: SuccessPage,
});
