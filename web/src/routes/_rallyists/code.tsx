import { useConfetti } from "@stevent-team/react-party";
import { createFileRoute } from "@tanstack/react-router";
import { ListChecks, TicketCheck } from "lucide-react";
import { LegacyRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { ButtonLink } from "@/components/ButtonLink.tsx";
import { Header } from "@/components/Header.tsx";
import Intro from "@/components/Intro.tsx";
import { StampDetails } from "@/components/StampDetails.tsx";
import { checkSignatureAndStoreStamp } from "@/lib/checkSignatureAndStoreStamp.ts";
import { stampsToCollect } from "@/lib/consts.ts";
import { useCollectedStamps } from "@/lib/hooks/useCollectedStamps.ts";
import { useRallySubmissions } from "@/lib/hooks/useRallySubmissions.ts";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { imagePrefix, images } from "@/lib/images.ts";
import { StampTupleSerializer } from "@/lib/models/Stamp.ts";

export const Route = createFileRoute("/_rallyists/code")({
  component: Code,
  pendingComponent: CodeLoading,
  errorComponent: CodeError,
  gcTime: 0,
  loader: async ({ location: { hash } }) => {
    if (!hash) throw new TypeError("No hash provided");

    const decodedHash = decodeURIComponent(hash);

    const parsed = JSON.parse(decodedHash);

    console.log("parsed", decodedHash, parsed);

    const serialized = StampTupleSerializer.safeParse(parsed);
    if (!serialized.success)
      throw new TypeError("Stamp cannot be deserialized");

    return checkSignatureAndStoreStamp(serialized.data);
  },
});

function Code() {
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
      }, 1000);
    }
  }, [showSubmitButton, createConfetti]);

  const showIntro =
    stamps?.length === 1 && (!submissions || submissions.length === 0);

  if (!standist) return <CodeError error={new Error("Standist not found")} />;

  return (
    <>
      <Header>{t("stand", { name: standist.name })}</Header>
      <canvas
        ref={canvasProps.ref as LegacyRef<HTMLCanvasElement> | null}
        className={"block absolute pointer-events-none inset-0 w-full h-full"}
      />
      <div className={"flex flex-col py-4 items-center gap-4"}>
        <img
          src={images[`${imagePrefix}${standist.image}`]}
          alt={standist.name}
          className={"rounded-full w-48 border-8 border-secondary"}
        />
        <div className="flex gap-2 text-green-700 text-xl font-bold items-center">
          <TicketCheck size={42} className="-rotate-12" /> {t("stampValidated")}
        </div>
        <div className="flex gap-2 text-green-700 text-xl font-bold items-center">
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

function CodeLoading() {
  const { t } = useTranslation();
  return t("loadingQRData");
}

function CodeError({ error }: { error: Error }) {
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
