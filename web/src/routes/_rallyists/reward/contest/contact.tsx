import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";

import { ContactPage } from "@/components/routes/rallyists/contest/ContactPage";
import { contestSecretSearchParamsSchema } from "@/searchParams.ts";

export const Route = createFileRoute("/_rallyists/reward/contest/contact")({
  validateSearch: zodValidator(contestSecretSearchParamsSchema),
  component: ContactPage,
});
