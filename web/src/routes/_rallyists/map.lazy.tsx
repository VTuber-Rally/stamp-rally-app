import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import {
  Gift,
  List,
  MessageCircleQuestion,
  ShoppingBag,
  TicketCheck,
} from "lucide-react";
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
                title: "Légende",
                description: (
                  <ul className="space-y-2">
                    <li className="flex gap-1">
                      <TicketCheck className="inline-block shrink-0 text-green-700" />{" "}
                      <div>
                        Les stands tamponnés sont affichés en{" "}
                        <span className="text-green-700">vert</span>.
                      </div>
                    </li>
                    <li className="flex gap-1">
                      <ShoppingBag className="inline-block shrink-0 text-blue-500" />
                      <div>
                        Les stands à visiter sont en{" "}
                        <span className="text-blue-500">bleu</span>.
                      </div>
                    </li>
                    <li className="flex gap-1">
                      <Gift className="inline-block shrink-0 text-yellow-600" />
                      <div>
                        Le stand auprès duquel récupérer des récompenses est en{" "}
                        <span className="text-yellow-600">jaune</span>.
                      </div>
                    </li>
                  </ul>
                ),
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
