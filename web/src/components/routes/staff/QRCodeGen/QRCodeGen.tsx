import { RefreshCcw, TicketCheck } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { Header } from "@/components/layout/Header.tsx";
import { QRCodeSettings } from "@/components/routes/staff/QRCodeGen/QRCodeSettings.tsx";
import { useStaffQRCode } from "@/lib/hooks/useStaffQRCode.ts";
import { useStandists } from "@/lib/hooks/useStandists.ts";

const QRCodeGenPage = ({ userId }: { userId: string }) => {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const { data: standists } = useStandists();
  const standist = standists.find((s) => s.userId === userId);

  const [perpetual, setPerpetual] = useState(false);
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  const {
    isLoading,
    error,
    data: qrValue,
  } = useStaffQRCode(userId, perpetual, expiryDate);

  return (
    <div className={"flex flex-col items-center"}>
      <Header className="flex flex-col items-center gap-2">
        <span className="w-full break-words">
          {tFR("stand", { name: standist?.name })}
        </span>
        <hr className="w-1/2 border-black/30" />
        <span className="w-full break-words">
          {tEN("stand", { name: standist?.name })}
        </span>
      </Header>
      <div className="flex flex-col items-center justify-center gap-2">
        {qrValue?.codeData && (
          <QRCode
            className="rounded-lg border-4 border-tertiary p-2"
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
        <QRCodeSettings
          perpetual={perpetual}
          onCheckedChange={setPerpetual}
          expiryDate={expiryDate}
          onExpiryChange={(e) =>
            setExpiryDate(e.target.value ? new Date(e.target.value) : null)
          }
          resetExpiry={() => setExpiryDate(null)}
        />
      </div>
    </div>
  );
};

export default QRCodeGenPage;
