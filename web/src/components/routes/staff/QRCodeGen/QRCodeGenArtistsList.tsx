import { useStandists } from "@/lib/hooks/useStandists.ts";
import { Header } from "@/components/Header.tsx";
import clsx from "clsx";
import { imagePrefix, images } from "@/lib/images.ts";
import { Link } from "@tanstack/react-router";

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
                {images[
                  `${imagePrefix}${doc.image}` as keyof typeof images
                ] && (
                  <Link
                    to="/staff/gen-qrcode/$userId"
                    params={{ userId: doc.userId }}
                  >
                    <img
                      src={images[`${imagePrefix}${doc.image}`]}
                      alt={doc.name}
                      className={"rounded-full w-32 border-8 border-secondary"}
                    />
                  </Link>
                )}

                <div className="text-center relative bg-secondary w-40 py-1 rounded-xl">
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
