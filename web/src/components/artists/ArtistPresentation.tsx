import { Link } from "@tanstack/react-router";
import centroid from "@turf/centroid";
import { polygon } from "@turf/helpers";
import { ArrowUpRightFromSquare, MapPinned } from "lucide-react";
import type { FC, ReactNode } from "react";
import { Suspense } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import QRCodeLink from "@/components/controls/QRCodeLink.tsx";
import { DrawerDescription, DrawerTitle } from "@/components/layout/Drawer.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { ConvexId } from "@/lib/convex.ts";
import { useCardDesignById } from "@/lib/hooks/inventory/useCardDesigns";
import { useBooth } from "@/lib/hooks/useBooth.ts";

import { ArtistImage } from "./ArtistImage";

export const ArtistPresentation: FC<{ boothId: ConvexId<"booths"> }> = ({
  boothId,
}) => {
  const { t } = useTranslation();
  const booth = useBooth(boothId);
  const cardDesign = useCardDesignById(booth?.cardDesign);

  if (!booth) return null;

  return (
    <div
      className={
        "mt-2 flex h-[70dvh] flex-col items-center space-y-4 overflow-y-auto p-2 pt-0"
      }
    >
      <DrawerTitle className="sr-only">{booth.name}</DrawerTitle>
      <DrawerDescription className="sr-only">
        {booth.description}
      </DrawerDescription>

      <Header className="text-center">{booth.name}</Header>

      <div className={"flex flex-col items-center"}>
        <Suspense
          fallback={
            <div className="h-32 w-32 animate-pulse rounded-full border-8 border-secondary bg-gray-200" />
          }
        >
          <ArtistImage imageUrl={booth.imageUrl} name={booth.name} />
        </Suspense>
      </div>

      {!!booth.geometry.length && (
        <Link
          to={"/map"}
          search={{
            center: centroid(polygon(booth.geometry)).geometry.coordinates,
          }}
          className="flex items-center gap-2 rounded-xl bg-secondary p-2 text-2xl"
        >
          H{booth.hall} {booth.boothNumber} <MapPinned />
        </Link>
      )}

      <p className="mx-2 max-w-prose rounded-xl bg-gray-100 p-2 whitespace-pre-line">
        {booth.description}
      </p>

      <div className={"flex flex-wrap gap-2"}>
        {booth.links.twitter && (
          <ExternalLink href={`https://twitter.com/${booth.links.twitter}`}>
            Twitter
          </ExternalLink>
        )}
        {booth.links.instagram && (
          <ExternalLink href={`https://instagram.com/${booth.links.instagram}`}>
            Instagram
          </ExternalLink>
        )}
        {booth.links.twitch && (
          <ExternalLink href={`https://twitch.tv/${booth.links.twitch}`}>
            Twitch
          </ExternalLink>
        )}
        {booth.links.website && (
          <ExternalLink href={booth.links.website}>
            {URL.parse(booth.links.website)?.hostname}
          </ExternalLink>
        )}
      </div>
      {cardDesign.status === "success" && !!cardDesign.data && (
        <div className="mx-auto flex max-w-lg items-center gap-2 rounded-xl bg-gray-100 p-4 shadow-md">
          <p className="w-1/2 text-lg">
            {t("artistPresentation.cardDescription", {
              artistName: cardDesign.data.artist,
              cardName: cardDesign.data.name,
            })}
          </p>
          <img
            src={cardDesign.data.imageUrl}
            alt={cardDesign.data.name}
            className="w-1/2 rounded"
          />
        </div>
      )}
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
