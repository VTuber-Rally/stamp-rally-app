import { createFileRoute } from "@tanstack/react-router";
import ArtistsListComponent from "@/components/routes/rallyists/ArtistsList.tsx";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";

export const Route = createFileRoute("/_rallyists/artists/")({
  component: ArtistsList,
});

function ArtistsList() {
  const { data = [] } = useCollectedStamps();

  return <ArtistsListComponent stamps={data} />;
}
