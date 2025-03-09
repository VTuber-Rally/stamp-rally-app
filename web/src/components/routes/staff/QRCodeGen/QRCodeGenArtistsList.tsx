import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ErrorBoundary } from "react-error-boundary";

import { ArtistImage } from "@/components/artists/ArtistImage";
import { Header } from "@/components/layout/Header.tsx";
import { QUERY_KEYS } from "@/lib/QueryKeys";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { queryClient } from "@/lib/queryClient";

import { ImageErrorFallback } from "../../rallyists/ArtistsList";

function QRCodeGenArtistsList() {
  const { data: standistsList } = useStandists();

  return (
    <div className={"mb-4"}>
      <Header>Usurper un artiste</Header>
      {standistsList && (
        <div className={"grid grid-cols-2 gap-4 overflow-x-scroll"}>
          {standistsList.map((doc) => {
            return (
              <div
                key={doc.userId}
                className={clsx("flex flex-col items-center gap-2")}
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
                  <Link
                    to="/staff/gen-qrcode/$userId"
                    params={{ userId: doc.userId }}
                  >
                    <ArtistImage userId={doc.userId} name={doc.name} />
                  </Link>
                </ErrorBoundary>

                <div className="relative w-40 rounded-xl bg-secondary py-1 text-center">
                  <p>{doc.name}</p>
                  <p>
                    H{doc.hall} {doc.boothNumber}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default QRCodeGenArtistsList;
