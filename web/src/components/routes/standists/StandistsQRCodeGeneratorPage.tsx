import { RefreshCcw, Stamp } from "lucide-react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import Loader from "@/components/Loader.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { useCurrentUser } from "@/lib/auth.ts";
import { useBooth } from "@/lib/hooks/useBooth.ts";
import { useBoothQrCode } from "@/lib/hooks/useBoothQrCode.ts";

const StandistsQRCodeGeneratorPage = () => {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const user = useCurrentUser();

  const booth = useBooth(user?.boothId);
  const { qrCodeData, error, isLoading } = useBoothQrCode(user?.boothId);

  if (isLoading || !user)
    return (
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center space-y-2"}>
          <Loader size={4} />
          <span>{t("loading")}</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex grow items-center justify-center">
        {error.message}
      </div>
    );

  if (!booth)
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
          {tFR("stand", { name: booth?.name })}
        </span>
        <hr className="w-1/2 border-black/30" />
        <span className="w-full break-words">
          {tEN("stand", { name: booth?.name })}
        </span>
      </Header>
      <div className="flex flex-col items-center justify-center gap-2">
        {qrCodeData && (
          <QRCode
            className="rounded-lg border-4 border-tertiary p-2"
            value={qrCodeData}
          />
        )}
        <div className={"flex"}>
          <Stamp className="mr-2" />
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
