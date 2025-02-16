import { createFileRoute } from "@tanstack/react-router";

import Rules from "@/components/routes/rallyists/Rules.tsx";

export const Route = createFileRoute("/_rallyists/rules")({
  component: Rules,
});
