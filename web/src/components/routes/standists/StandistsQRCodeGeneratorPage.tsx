import { RefreshCcw, TicketCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { Header } from "@/components/Header.tsx";
import Loader from "@/components/Loader.tsx";
import { useQrCode } from "@/lib/hooks/useQrCode.ts";
import { useStandist } from "@/lib/hooks/useStandist.ts";
import { useUser } from "@/lib/hooks/useUser.ts";

const StandistsQRCodeGeneratorPage = () => {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const { user } = useUser();
  const stand = useStandist(user!.$id); // normalement sur cette page, user est toujours défini
  const { isLoading, data: qrValue, error } = useQrCode();

  if (isLoading || !user)
    return (
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center space-y-2"}>
          <Loader size={4} />
          <span>{tFR("loading")}</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex grow items-center justify-center">
        {error.message}
      </div>
    );

  if (!stand)
    return (
      <>
        <Header>{t("stand", { name: "...?" })}</Header>
        <p>{t("errors.notAStandist")}</p>
      </>
    );

  return (
    <>
      <Header className="flex flex-col items-center gap-2">
        <span className="w-full break-words">
          {tFR("stand", { name: stand?.name })}
        </span>
        <hr className="w-1/2 border-black/30" />
        <span className="w-full break-words">
          {tEN("stand", { name: stand?.name })}
        </span>
      </Header>
      <div className="flex flex-col items-center justify-center gap-2">
        {qrValue?.codeData && (
          <QRCode
            className="rounded-lg border-4 border-tertiary p-2"
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
};

export default StandistsQRCodeGeneratorPage;
