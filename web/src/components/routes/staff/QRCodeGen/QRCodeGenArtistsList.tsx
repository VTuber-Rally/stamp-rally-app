import { Link } from "@tanstack/react-router";
import clsx from "clsx";

import { ArtistImage } from "@/components/artists/ArtistImage";
import { Header } from "@/components/layout/Header.tsx";
import { useStandists } from "@/lib/hooks/useStandists.ts";

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
                <Link
                  to="/staff/gen-qrcode/$userId"
                  params={{ userId: doc.userId }}
                >
                  <ArtistImage userId={doc.userId} name={doc.name} />
                </Link>

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
