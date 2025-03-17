import { createFileRoute } from "@tanstack/react-router";

import StampLinksArtistsList from "@/components/routes/staff/StampLinks/StampLinksArtistsList.tsx";

export const Route = createFileRoute("/staff/stamp-links")({
  component: StampLinksArtistsList,
});
