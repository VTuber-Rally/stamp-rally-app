import { useNavigate } from "@tanstack/react-router";
import clsx from "clsx";
import { MapIcon, Stamp as StampIcon } from "lucide-react";
import { Suspense, useState } from "react";
import { useTranslation } from "react-i18next";

import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { ArtistImage } from "@/components/artists/ArtistImage";
import { Header } from "@/components/layout/Header.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import { ConvexId } from "@/lib/convex.ts";
import { useBooths } from "@/lib/hooks/useBooths.ts";
import { Stamp } from "@/lib/stampStore.ts";

type ArtistsListProps = {
  stamps: Stamp[];
};

const ArtistsList = ({ stamps }: ArtistsListProps) => {
  const { t } = useTranslation();
  const { data: booths } = useBooths();
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [activeStandistId, setActiveStandistId] =
    useState<ConvexId<"booths"> | null>(null);
  const navigate = useNavigate();

  return (
    <>
      <ArtistDrawer
        open={artistDrawerOpen}
        setOpen={setArtistDrawerOpen}
        activeStandistId={activeStandistId}
      />
      <div className={"mb-4"}>
        <Header>
          <div className="flex w-full justify-between">
            <div className="content-center">{t("artists")}</div>
            <button
              className="ml-4 flex cursor-pointer items-center gap-2 rounded-xl bg-secondary p-2 text-xl"
              onClick={() => {
                void navigate({
                  to: "/map",
                });
              }}
            >
              <MapIcon />
              {t("map")}
            </button>
          </div>
        </Header>
        <RallyProgressBar hideMarker />
        {booths && (
          <div className={"grid grid-cols-2 gap-4 overflow-x-clip"}>
            {booths.map((booth) => {
              const isStamped =
                stamps.findIndex((stamp) => stamp.boothId === booth._id) !== -1;
              return (
                <button
                  key={booth._id}
                  className={clsx(
                    "flex flex-col items-center gap-2",
                    !isStamped && "opacity-45",
                  )}
                  onClick={() => {
                    setArtistDrawerOpen(true);
                    setActiveStandistId(booth._id);
                  }}
                >
                  <Suspense
                    fallback={
                      <div className="h-32 w-32 animate-pulse rounded-full border-8 border-secondary bg-gray-200" />
                    }
                  >
                    <ArtistImage imageUrl={booth.imageUrl} name={booth.name} />
                  </Suspense>

                  <div className="relative w-40 rounded-xl bg-secondary py-1 text-center">
                    <div>{booth.name}</div>
                    <div>
                      H{booth.hall} {booth.boothNumber}
                    </div>
                    {isStamped && (
                      <div className="absolute -top-6 -right-1 rotate-12 drop-shadow-sm">
                        <StampIcon strokeWidth={1.5} size={35} />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ArtistsList;
