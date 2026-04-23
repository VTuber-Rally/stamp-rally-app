import { RefreshCcw, TicketCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import Loader from "@/components/Loader.tsx";
import { Header } from "@/components/layout/Header.tsx";
import { encodeStampToQRCode } from "@/lib/StampQRCodes.ts";
import { useCurrentUser } from "@/lib/auth.ts";
import { useBoothWithPrivateKey } from "@/lib/hooks/useBoothWithPrivateKey.ts";
import { signData } from "@/lib/jwkSignatures.ts";

const getExpiryTimestamp = () => Date.now() + 2 * 60 * 1000; // 2 minutes comme avant

const StandistsQRCodeGeneratorPage = () => {
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const user = useCurrentUser();
  const booth = useBoothWithPrivateKey(user?.boothId);
  const [expiryTimestamp, setExpiryTimestamp] = useState(getExpiryTimestamp);
  const [isLoading, setIsLoading] = useState(true);
  const [qrCodeData, setQrCodeData] = useState("");
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!booth?._id) return;
    let ignore = false;
    const data = [booth._id, expiryTimestamp] as const;
    signData(booth.privateKey, data)
      .then(
        (signature) => {
          if (ignore) return;
          setQrCodeData(encodeStampToQRCode([...data, signature]));
        },
        (err: Error) => {
          if (ignore) return;
          setError(err);
        },
      )
      .finally(() => setIsLoading(false));

    return () => {
      ignore = true;
    };
  }, [expiryTimestamp, booth?.privateKey, booth?._id]);

  useEffect(() => {
    const interval = setInterval(() => {
      setExpiryTimestamp(getExpiryTimestamp());
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

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
