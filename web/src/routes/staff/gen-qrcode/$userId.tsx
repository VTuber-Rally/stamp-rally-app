import { createFileRoute } from "@tanstack/react-router";
import { useStaffQRCode } from "@/lib/hooks/useStaffQRCode.ts";
import QRCode from "react-qr-code";
import { Header } from "@/components/Header.tsx";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { Switch } from "@/components/Switch.tsx";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Cog, RefreshCcw, TicketCheck } from "lucide-react";

export const Route = createFileRoute("/staff/gen-qrcode/$userId")({
  component: GenQrCode,
});

function GenQrCode() {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const { userId } = Route.useParams();
  const { data: standists } = useStandists();
  const standist = standists.find((s) => s.userId === userId);

  const [perpetual, setPerpetual] = useState(false);

  const { isLoading, error, data: qrValue } = useStaffQRCode(userId, perpetual);

  return (
    <div className={"flex flex-col items-center"}>
      <Header className="flex flex-col items-center gap-2">
        <span className="break-words w-full">
          {tFR("stand", { name: standist?.name })}
        </span>
        <hr className="w-1/2 border-black/30" />
        <span className="break-words w-full">
          {tEN("stand", { name: standist?.name })}
        </span>
      </Header>
      <div className="flex flex-col items-center justify-center gap-2">
        {qrValue?.codeData && (
          <QRCode
            className="border-4 rounded-lg border-tertiary p-2"
            value={qrValue.codeData}
          />
        )}
        {isLoading && <p>{t("loading")}</p>}
        {error && <p>Error: {error.message}</p>}
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
        <details className="border-dashed border-4 border-secondaryLight p-2 group">
          <summary className="flex justify-center items-center gap-1 group-open:pb-2 select-none">
            <Cog /> QR Settings
          </summary>
          {perpetual ? "Perpetual QR code" : "One-time QR code"}
          <div className="flex items-center space-x-2 mt-2">
            <Switch
              id="perpetual-qrcode"
              checked={perpetual}
              onCheckedChange={setPerpetual}
            />
            <label htmlFor="perpetual-qrcode">Perpetual QR code</label>
          </div>
        </details>
      </div>
    </div>
  );
}
