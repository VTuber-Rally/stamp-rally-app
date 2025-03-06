import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import { List, MessageCircleQuestion } from "lucide-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import { MapLibreMap } from "@/components/MapLibreMap.tsx";
import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { ButtonGroupControl } from "@/components/map/ButtonGroupControl.tsx";
import { MapButton } from "@/components/map/MapButton.tsx";
import { MapLegend } from "@/components/map/MapLegend.tsx";
import { useToast } from "@/lib/hooks/useToast.ts";

export const Route = createLazyFileRoute("/_rallyists/map")({
  component: StandMap,
});

function StandMap() {
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [activeStandistId, setActiveStandistId] = useState<string | null>(null);
  const { toast } = useToast();
  const { t } = useTranslation();

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
          <MapButton
            onClick={() =>
              toast({
                title: t("mapLegend.title"),
                description: <MapLegend />,
              })
            }
          >
            <MessageCircleQuestion size={20} />
          </MapButton>
        </ButtonGroupControl>
      </MapLibreMap>
    </>
  );
}
