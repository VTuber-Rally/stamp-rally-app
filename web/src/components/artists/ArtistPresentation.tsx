import { Link } from "@tanstack/react-router";
import centroid from "@turf/centroid";
import { polygon } from "@turf/helpers";
import { ArrowUpRightFromSquare, MapPinned } from "lucide-react";
import type { FC, ReactNode } from "react";
import { Suspense } from "react";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import QRCodeLink from "@/components/controls/QRCodeLink.tsx";
import { DrawerDescription, DrawerTitle } from "@/components/layout/Drawer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useStandist } from "@/lib/hooks/useStandist.ts";

import { ArtistImage } from "./ArtistImage";

export const ArtistPresentation: FC<{ artistId: string }> = ({ artistId }) => {
  const artist = useStandist(artistId);

  if (!artist) return null;

  return (
    <div
      className={
        "mt-2 flex h-[70dvh] flex-col items-center space-y-4 overflow-y-auto p-2 pt-0"
      }
    >
      <DrawerTitle className="sr-only">{artist.name}</DrawerTitle>
      <DrawerDescription className="sr-only">
        {artist.description}
      </DrawerDescription>

      <Header className="text-center">{artist.name}</Header>

      <div className={"flex flex-col items-center"}>
        <Suspense
          fallback={
            <div className="h-32 w-32 animate-pulse rounded-full border-8 border-secondary bg-gray-200" />
          }
        >
          <ArtistImage userId={artist.userId} name={artist.name} />
        </Suspense>
      </div>

      {artist.geometry && (
        <Link
          to={"/map"}
          search={{
            center: centroid(polygon(artist.geometry)).geometry.coordinates,
          }}
          className="flex items-center gap-2 rounded-xl bg-secondary p-2 text-2xl"
        >
          H{artist.hall} {artist.boothNumber} <MapPinned />
        </Link>
      )}

      <p className="mx-2 max-w-prose rounded-xl bg-gray-100 p-2 whitespace-pre-line">
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
