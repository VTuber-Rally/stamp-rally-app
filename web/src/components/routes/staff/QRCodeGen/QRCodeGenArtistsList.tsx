import { Link } from "@tanstack/react-router";

import { ArtistImage } from "@/components/artists/ArtistImage";
import { ButtonLink } from "@/components/controls/ButtonLink";
import { Header } from "@/components/layout/Header.tsx";
import { useBooths } from "@/lib/hooks/useBooths.ts";

function QRCodeGenArtistsList() {
  const { data: booths } = useBooths();

  return (
    <div className={"mb-4"}>
      <Header>Usurper un artiste</Header>
      {booths && (
        <div className="grid grid-cols-2 gap-4 overflow-x-auto">
          {booths.map((booth) => {
            return (
              <Link
                key={booth._id}
                to="/staff/gen-qrcode/$userId"
                params={{ userId: booth._id }}
                className="flex flex-col items-center gap-2"
              >
                <ArtistImage imageUrl={booth.imageUrl} name={booth.name} />
                <div className="relative w-40 rounded-xl bg-secondary py-1 text-center">
                  <p>{booth.name}</p>
                  <p>
                    H{booth.hall} {booth.boothNumber}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <ButtonLink size={"small"} href="/staff/stamp-links">
        Liens des stamps
      </ButtonLink>
    </div>
  );
}

export default QRCodeGenArtistsList;
