import { createFileRoute } from "@tanstack/react-router";

import StandistsProfilePage from "@/components/routes/standists/StandistsProfilePage.tsx";

export const Route = createFileRoute("/standists/profile")({
  component: StandistsProfilePage,
});
