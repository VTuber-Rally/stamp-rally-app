import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { List } from "lucide-react";
import { useCallback, useState } from "react";

import { MapLibreMap } from "@/components/MapLibreMap.tsx";
import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { ButtonGroupControl } from "@/components/map/ButtonGroupControl";
import { MapButton } from "@/components/map/MapButton";

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

  const navigate = useNavigate();

  return (
    <>
      <ArtistDrawer
        open={artistDrawerOpen}
        setOpen={setArtistDrawerOpen}
        activeStandistId={activeStandistId}
      />
      <MapLibreMap onStandClick={onStandClick}>
        <ButtonGroupControl placement="top-right">
          <MapButton onClick={() => navigate({ to: "/artists" })}>
            <List size={20} />
          </MapButton>
        </ButtonGroupControl>
      </MapLibreMap>
    </>
  );
}
