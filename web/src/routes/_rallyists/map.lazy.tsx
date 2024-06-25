import { createLazyFileRoute } from "@tanstack/react-router";
import { MapLibreMap } from "@/components/MapLibreMap.tsx";
import { useCallback, useState } from "react";
import { ArtistDrawer } from "@/components/ArtistDrawer.tsx";

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
