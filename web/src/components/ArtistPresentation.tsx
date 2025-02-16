import { Link } from "@tanstack/react-router";
import centroid from "@turf/centroid";
import { polygon } from "@turf/helpers";
import { ArrowUpRightFromSquare, MapPinned } from "lucide-react";
import type { FC, ReactNode } from "react";

import { ButtonLink } from "@/components/ButtonLink.tsx";
import { DrawerDescription, DrawerTitle } from "@/components/Drawer.tsx";
import { Header } from "@/components/Header.tsx";
import QRCodeLink from "@/components/QRCodeLink.tsx";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { imagePrefix, images } from "@/lib/images.ts";

export const ArtistPresentation: FC<{ artistId: string }> = ({ artistId }) => {
  const artist = useStandist(artistId);

  if (!artist) return null;

  return (
    <div
      className={
        "flex flex-col items-center space-y-4 mt-2 p-2 pt-0 h-[70dvh] overflow-y-auto"
      }
    >
      <DrawerTitle className="sr-only">{artist.name}</DrawerTitle>
      <DrawerDescription className="sr-only">
        {artist.description}
      </DrawerDescription>

      <Header>{artist.name}</Header>

      <div className={"flex flex-col items-center"}>
        <img
          src={images[`${imagePrefix}${artist.image}`]}
          alt={artist.name}
          className="rounded-full w-48 border-8 border-secondary"
        />
      </div>

      {artist.geometry && (
        <Link
          to={"/map"}
          search={{
            center: centroid(polygon(artist.geometry)).geometry.coordinates,
          }}
          className="flex items-center gap-2 text-2xl bg-secondary p-2 rounded-xl"
        >
          H{artist.hall} {artist.boothNumber} <MapPinned />
        </Link>
      )}

      <p className="whitespace-pre-line bg-gray-100 p-2 rounded-xl mx-2 max-w-prose">
        {artist.description}
      </p>

      <div className={"flex flex-wrap gap-2"}>
        {artist.twitter && (
          <ExternalLink href={`https://twitter.com/${artist.twitter}`}>
            Twitter
          </ExternalLink>
        )}
        {artist.instagram && (
          <ExternalLink href={`https://instagram.com/${artist.instagram}`}>
            Instagram
          </ExternalLink>
        )}
        {artist.twitch && (
          <ExternalLink href={artist.twitch}>Twitch</ExternalLink>
        )}
      </div>
      <QRCodeLink />
    </div>
  );
};

type ExternalLinkProps = {
  href: string;
  children: ReactNode;
};

const ExternalLink = ({ href, children }: ExternalLinkProps) => (
  <ButtonLink target={"_blank"} href={href} size={"small"}>
    {children} <ArrowUpRightFromSquare size={20} className="ml-2" />
  </ButtonLink>
);
