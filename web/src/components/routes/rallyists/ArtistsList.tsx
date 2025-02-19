import clsx from "clsx";
import { TicketCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { stampsToCollect } from "@/lib/consts.ts";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { imagePrefix, images } from "@/lib/images.ts";
import { StampWithId } from "@/lib/models/Stamp.ts";

type ArtistsListProps = {
  stamps: StampWithId[];
};

const ArtistsList = ({ stamps }: ArtistsListProps) => {
  const { t } = useTranslation();
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
        <p className="my-4 text-center text-xl">
          {t("stampsCount", {
            count: stamps.length,
            maxCount: stampsToCollect,
          })}
        </p>
        {standistsList && (
          <div className={"grid grid-cols-2 gap-4 overflow-x-clip"}>
            {standistsList.map((doc) => {
              const isStamped =
                stamps.findIndex((stamp) => stamp.standistId === doc.userId) !==
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
                      className={"w-32 rounded-full border-8 border-secondary"}
                    />
                  )}

                  <div className="relative w-40 rounded-xl bg-secondary py-1 text-center">
                    <div>{doc.name}</div>
                    <div>
                      H{doc.hall} {doc.boothNumber}
                    </div>
                    {isStamped ? (
                      <div className="absolute -top-1 -right-1 rotate-12 drop-shadow-sm">
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
};

export default ArtistsList;
