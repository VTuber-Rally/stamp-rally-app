import { createFileRoute } from "@tanstack/react-router";
import QRCode from "react-qr-code";
import { useQrCode } from "@/lib/hooks/useQrCode.ts";
import Loader from "@/components/Loader.tsx";
import { Header } from "@/components/Header.tsx";
import { useTranslation } from "react-i18next";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { RefreshCcw, TicketCheck } from "lucide-react";
import { useUser } from "@/lib/hooks/useUser.ts";

export const Route = createFileRoute("/standists/qrcode/")({
  component: StandistsQrcode,
});

function StandistsQrcode() {
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const { user } = useUser();
  const stand = useStandist(user!.$id); // normalement sur cette page, user est toujours défini
  const { isLoading, data: qrValue, error } = useQrCode();

  if (isLoading || !user)
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className={"flex flex-col space-y-2 items-center"}>
          <Loader size={4} />
          <span>{tFR("loading")}</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex-grow flex items-center justify-center">
        {error.message}
      </div>
    );

  if (!stand)
    return (
      <div className="flex-grow flex flex-col items-center justify-center">
        <span>Stand not found?</span>
        <span className={"italic"}>Are you sure you are a standist?</span>
      </div>
    );

  return (
    <>
      <Header className="flex flex-col items-center gap-2">
        <span className="break-words w-full">
          {tFR("stand", { name: stand?.name })}
        </span>
        <hr className="w-1/2 border-black/30" />
        <span className="break-words w-full">
          {tEN("stand", { name: stand?.name })}
        </span>
      </Header>
      <div className="flex flex-col items-center justify-center gap-2">
        {qrValue?.codeData && (
          <QRCode
            className="border-4 rounded-lg border-tertiary p-2"
            value={qrValue.codeData}
          />
        )}
        <div className={"flex"}>
          <TicketCheck className="mr-2" />
          <p>
            {tFR("scanThisQR")}
            <br />
            {tEN("scanThisQR")}
          </p>
        </div>
        <div className={"flex"}>
          <RefreshCcw className="mr-2" />
          <p>
            {tFR("QRRenewNotice")} <br />
            {tEN("QRRenewNotice")}
          </p>
        </div>
      </div>
    </>
  );
}
