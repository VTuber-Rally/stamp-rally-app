import { createFileRoute } from "@tanstack/react-router";

import Contest from "@/components/routes/staff/Contest";

export const Route = createFileRoute("/staff/contest")({
  component: Contest,
});
