import { useConfetti } from "@stevent-team/react-party";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, TicketCheck } from "lucide-react";
import { LegacyRef, Suspense, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Intro from "@/components/Intro.tsx";
import { ArtistImage } from "@/components/artists/ArtistImage";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { StampDetails } from "@/components/scan/StampDetails.tsx";
import { checkSignatureAndStoreStamp } from "@/lib/checkSignatureAndStoreStamp";
import { stampsToCollect } from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { StampTupleSerializer } from "@/lib/models/Stamp.ts";

export const Route = createFileRoute("/_rallyists/stamp")({
  component: Stamp,
  errorComponent: StampError,
  loader: async ({ location: { hash } }) => {
    if (!hash) throw new TypeError("No hash provided");

    const decodedHash = decodeURIComponent(hash);

    const parsed = JSON.parse(decodedHash);

    const serialized = StampTupleSerializer.safeParse(parsed);
    if (!serialized.success) {
      console.log("error", serialized.error);
      throw new TypeError("Stamp cannot be deserialized");
    }

    return checkSignatureAndStoreStamp(serialized.data);
  },
});

function Stamp() {
  const data = Route.useLoaderData();

  const { t } = useTranslation();

  const standist = useStandist(data.standistId);

  const { data: stamps } = useCollectedStamps();

  const showSubmitButton = (stamps?.length ?? 1) >= stampsToCollect;

  const { data: submissions } = useRallySubmissions();

  const { createConfetti, canvasProps } = useConfetti({
    count: 700,
    duration: 2000,
  });

  useEffect(() => {
    if (showSubmitButton) {
      setTimeout(() => {
        createConfetti();
        window.plausible("Rally Completed");
      }, 1000);
    }
  }, [showSubmitButton, createConfetti]);

  const showIntro =
    stamps?.length === 1 && (!submissions || submissions.length === 0);

  if (!standist) return <StampError error={new Error("Standist not found")} />;

  return (
    <>
      <Header>{t("stand", { name: standist.name })}</Header>
      <canvas
        ref={canvasProps.ref as LegacyRef<HTMLCanvasElement> | null}
        className={"pointer-events-none absolute inset-0 block h-full w-full"}
      />
      <div className={"flex flex-col items-center gap-4 py-4"}>
        {/* au cas où les images plantes pour x raison */}
        <Suspense
          fallback={
            <div className="h-32 w-32 animate-pulse rounded-full border-8 border-secondary bg-gray-200" />
          }
        >
          <ArtistImage userId={standist.userId} name={standist.name} />
        </Suspense>
        <div className="flex items-center gap-2 text-xl font-bold text-green-700">
          <TicketCheck size={42} className="-rotate-12" /> {t("stampValidated")}
        </div>
        <div className="flex items-center gap-2 text-xl font-bold text-green-700">
          <ListChecks size={42} />{" "}
          {t("stampsCount", {
            count: stamps?.length ?? 1,
            maxCount: stampsToCollect,
          })}
        </div>
        {showSubmitButton && (
          <ButtonLink
            bg={"success-orange"}
            href="/web/src/routes/_rallyists/_withUserProvider"
          >
            {t("requestYourReward")}
          </ButtonLink>
        )}
        <ButtonLink href="/artists" bg="tertiary">
          {t("artistList")}
        </ButtonLink>
      </div>

      {showIntro && (
        <div className={"pb-4"}>
          <Intro />
        </div>
      )}

      <StampDetails stamp={data} standist={standist} />
    </>
  );
}

function StampError({ error }: { error: Error }) {
  const { t } = useTranslation();

  return (
    <div>
      <p>{t("QRCodeValidationError.title")}</p>
      <p>
        <em>{t("QRCodeValidationError.tip")}</em>
      </p>
      <details className="overflow-x-auto">
        <summary>{t("QRCodeValidationError.details")}</summary>
        <pre>{error.stack}</pre>
      </details>
    </div>
  );
}
