import { useTranslation } from "react-i18next";
import { useStandists } from "@/lib/hooks/useStandists.ts";
import { useState } from "react";
import { useStaffQRCode } from "@/lib/hooks/useStaffQRCode.ts";
import { Header } from "@/components/Header.tsx";
import QRCode from "react-qr-code";
import { Cog, RefreshCcw, TicketCheck } from "lucide-react";
import { Switch } from "@/components/Switch.tsx";

const QRCodeGenPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
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
        <details className="border-dashed border-4 border-secondary-light p-2 group">
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
};

export default QRCodeGenPage;
