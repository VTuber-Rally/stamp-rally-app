import { createLazyFileRoute } from "@tanstack/react-router";
import { TicketCheck } from "lucide-react";
import { useCallback, useState } from "react";

import { MapLibreMap } from "@/components/MapLibreMap.tsx";
import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { ButtonGroupControl } from "@/components/map/ButtonGroupControl.tsx";
import { MapButton } from "@/components/map/MapButton.tsx";
import { useToast } from "@/lib/hooks/useToast.ts";

export const Route = createLazyFileRoute("/_rallyists/map")({
  component: StandMap,
});

function StandMap() {
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [activeStandistId, setActiveStandistId] = useState<string | null>(null);
  const { toast } = useToast();

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
      <MapLibreMap onStandClick={onStandClick}>
        <ButtonGroupControl placement="top-right">
          <MapButton onClick={() => toast({ description: "Les artistes" })}>
            <TicketCheck size={20} />
          </MapButton>
        </ButtonGroupControl>
      </MapLibreMap>
    </>
  );
}
