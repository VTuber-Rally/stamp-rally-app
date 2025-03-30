import { createFileRoute } from "@tanstack/react-router";

import { ContactPage } from "@/components/routes/rallyists/contest/ContactPage";
import { searchParamsValidator } from "@/lib/contest";

export const Route = createFileRoute(
  "/_rallyists/_withUserProvider/reward/contest/contact",
)({
  component: ContactPage,
  validateSearch: searchParamsValidator,
});
