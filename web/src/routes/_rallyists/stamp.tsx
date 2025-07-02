import { useConfetti } from "@stevent-team/react-party";
import { createFileRoute } from "@tanstack/react-router";
import { MessageSquareWarning, TicketCheck } from "lucide-react";
import { LegacyRef, Suspense, useEffect } from "react";
import { Trans, useTranslation } from "react-i18next";

import { StampTupleSerializer } from "@vtube-stamp-rally/shared-lib/models/Stamp.ts";

import Intro from "@/components/Intro.tsx";
import { ArtistImage } from "@/components/artists/ArtistImage";
import { ButtonLink } from "@/components/controls/ButtonLink.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { RallyProgressBar } from "@/components/reward/RallyProgressBar.tsx";
import { StampDetails } from "@/components/scan/StampDetails.tsx";
import { checkSignatureAndStoreStamp } from "@/lib/checkSignatureAndStoreStamp";
import {
  premiumRewardMinStampsRequirement,
  standardRewardMinStampsRequirement,
} from "@/lib/consts.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useRewardAvailability } from "@/lib/hooks/useRewardAvailability.ts";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import {
  orangeTriangleEmphasis,
  pinkSquareEmphasis,
} from "@/lib/transComponentSets.tsx";

export const Route = createFileRoute("/_rallyists/stamp")({
  component: Stamp,
  errorComponent: StampError,
  loader: async ({ location: { hash } }) => {
    if (!hash) throw new TypeError("No hash provided");

    const decodedHash = decodeURIComponent(hash);

    const parsed = JSON.parse(decodedHash) as unknown;

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

  const { isAnyStampFromMinorHall, stampCount, isStandardRewardObtainable } =
    useRewardAvailability();

  const showSubmitButton = isStandardRewardObtainable;

  const launchConfetti =
    [
      standardRewardMinStampsRequirement,
      premiumRewardMinStampsRequirement,
    ].includes(stampCount) && isAnyStampFromMinorHall;

  const { data: submissions } = useRallySubmissions();

  const { createConfetti, canvasProps } = useConfetti({
    count: 200,
    duration: 2000,
  });

  useEffect(() => {
    if (launchConfetti) {
      setTimeout(() => {
        void createConfetti();
        window.plausible("Goal obtained", {
          props: {
            rallyGoal:
              stampCount === standardRewardMinStampsRequirement
                ? "standard"
                : "premium",
          },
        });
      }, 1000);
    }
  }, [launchConfetti, createConfetti, stampCount]);

  const showIntro =
    stampCount === 1 && (!submissions || submissions.length === 0);

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
        <div className="flex items-center gap-2 text-xl font-bold text-green-800">
          <TicketCheck size={42} className="-rotate-12" /> {t("stampValidated")}
        </div>
        <RallyProgressBar />
        <p className="text-gray-700">
          {!isAnyStampFromMinorHall &&
            stampCount >= standardRewardMinStampsRequirement - 2 && (
              <span className="mb-2 block border-4 border-amber-700 p-2">
                <MessageSquareWarning className="mb-2 text-amber-700" />
                <Trans
                  t={t}
                  i18nKey="stampGoals.scanFromMinorHall"
                  components={{ strong: <strong />, em: <em /> }}
                />
              </span>
            )}
          {(isAnyStampFromMinorHall || !isStandardRewardObtainable) && (
            <>
              <Trans
                t={t}
                i18nKey="stampGoals.getToStandardCardReward"
                components={orangeTriangleEmphasis}
                values={{
                  count: Math.max(
                    standardRewardMinStampsRequirement - stampCount,
                    0,
                  ),
                }}
              />
              <br className="mb-2" />
            </>
          )}
          <Trans
            t={t}
            i18nKey="stampGoals.getToPremiumCardReward"
            components={pinkSquareEmphasis}
            values={{
              count: Math.max(
                premiumRewardMinStampsRequirement - stampCount,
                0,
              ),
            }}
          />
        </p>
        {showSubmitButton && (
          <ButtonLink bg={"success-orange"} href="/reward">
            {t("reward.pageTitle")}
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
