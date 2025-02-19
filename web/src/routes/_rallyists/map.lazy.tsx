import { createLazyFileRoute } from "@tanstack/react-router";
import { useCallback, useState } from "react";

import { MapLibreMap } from "@/components/MapLibreMap.tsx";
import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";

export const Route = createLazyFileRoute("/_rallyists/map")({
  component: StandMap,
});

function StandMap() {
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [activeStandistId, setActiveStandistId] = useState<string | null>(null);

  const onStandClick = useCallback((standId: string) => {
    setArtistDrawerOpen(true);
    setActiveStandistId(standId);
  }, []);

  return (
    <>
      <ArtistDrawer
        open={artistDrawerOpen}
        setOpen={setArtistDrawerOpen}
        activeStandistId={activeStandistId}
      />
      <MapLibreMap onStandClick={onStandClick} />
    </>
  );
}
