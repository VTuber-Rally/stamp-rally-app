import clsx from "clsx";
import { TicketCheck } from "lucide-react";
import { Suspense, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useTranslation } from "react-i18next";

import { ArtistDrawer } from "@/components/artists/ArtistDrawer.tsx";
import { ArtistImage } from "@/components/artists/ArtistImage";
import { Header } from "@/components/layout/Header.tsx";
import { QUERY_KEYS } from "@/lib/QueryKeys.ts";
import { stampsToCollect } from "@/lib/consts.ts";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { StampWithId } from "@/lib/models/Stamp.ts";
import { queryClient } from "@/lib/queryClient";

type ArtistsListProps = {
  stamps: StampWithId[];
};

export const ImageErrorFallback = ({
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => {
  return (
    <div
      onClick={resetErrorBoundary}
      className="flex h-32 w-32 cursor-pointer items-center justify-center rounded-full border-8 border-secondary bg-gray-100"
    >
      <div className="text-center text-sm text-gray-500">
        Cliquez pour réessayer
      </div>
    </div>
  );
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
                  {/* au cas où les images plantes pour x raison */}
                  <ErrorBoundary
                    FallbackComponent={ImageErrorFallback}
                    onReset={() => {
                      queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.ARTIST_IMAGE, doc.userId],
                      });
                    }}
                  >
                    <Suspense
                      fallback={
                        <div className="h-32 w-32 animate-pulse rounded-full border-8 border-secondary bg-gray-200" />
                      }
                    >
                      <ArtistImage userId={doc.userId} name={doc.name} />
                    </Suspense>
                  </ErrorBoundary>

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
