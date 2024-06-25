import { createFileRoute } from "@tanstack/react-router";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useTranslation } from "react-i18next";
import { TicketCheck } from "lucide-react";
import clsx from "clsx";
import { STAMPS_TO_COLLECT } from "@/assets/stampRequirements.ts";
import { Header } from "@/components/Header.tsx";
import { imagePrefix, images } from "@/lib/images.ts";
import { useState } from "react";
import { ArtistDrawer } from "@/components/ArtistDrawer.tsx";

export const Route = createFileRoute("/_rallyists/artists/")({
  component: ArtistsList,
});

function ArtistsList() {
  const { t } = useTranslation();
  const { data = [] } = useCollectedStamps();
  const { data: standistsList } = useStandists();
  const [artistDrawerOpen, setArtistDrawerOpen] = useState(false);
  const [activeStandistId, setActiveStandistId] = useState<string | null>(null);

  return (
    <>
      <ArtistDrawer
        open={artistDrawerOpen}
        setOpen={setArtistDrawerOpen}
        activeStandistId={activeStandistId}
      />
      <div className={"mb-4"}>
        <Header>{t("artistList")}</Header>
        <p className="text-xl text-center my-4">
          {t("stampsCount", {
            count: data.length,
            maxCount: STAMPS_TO_COLLECT,
          })}
        </p>
        {standistsList && (
          <div className={"grid grid-cols-2 gap-4 overflow-x-clip"}>
            {standistsList.map((doc) => {
              const isStamped =
                data.findIndex((stamp) => stamp.standistId === doc.userId) !==
                -1;
              return (
                <button
                  key={doc.userId}
                  className={clsx(
                    "flex flex-col items-center gap-2",
                    !isStamped && "opacity-45",
                  )}
                  onClick={() => {
                    setArtistDrawerOpen(true);

                    setActiveStandistId(doc.userId);
                  }}
                >
                  {images[
                    `${imagePrefix}${doc.image}` as keyof typeof images
                  ] && (
                    <img
                      src={images[`${imagePrefix}${doc.image}`]}
                      alt={doc.name}
                      className={"rounded-full w-32 border-8 border-secondary"}
                    />
                  )}

                  <div className="text-center relative bg-secondary w-40 py-1 rounded-xl">
                    <div>{doc.name}</div>
                    <div>
                      H{doc.hall} {doc.boothNumber}
                    </div>
                    {isStamped ? (
                      <div className="absolute -right-1 -top-1 rotate-12 drop-shadow">
                        <TicketCheck size={30} />
                      </div>
                    ) : null}
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
