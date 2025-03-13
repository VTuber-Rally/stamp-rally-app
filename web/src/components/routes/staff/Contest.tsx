import clsx from "clsx";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { useContestParticipants } from "@/lib/hooks/useContestParticipants";
import { useContestQRCode } from "@/lib/hooks/useContestQRCode";

export default function Contest() {
  const { data: participants, isLoading, error } = useContestParticipants();
  const { data: qrCode, isLoading: isQRCodeLoading } = useContestQRCode();
  const [isQRFullscreen, setIsQRFullscreen] = useState(false);
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });

  const handleDrawWinner = async () => {
    // TODO
  };

  const sendNotification = async () => {
    // TODO
  };

  if (isLoading || isQRCodeLoading) {
    return (
      <div className="flex grow items-center justify-center">
        <div className={"flex flex-col items-center space-y-2"}>
          <Loader size={4} />
          <span>{t("loading")}</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg text-red-600">
          {t("contest.staff.participants.loadingError")}
        </div>
      </div>
    );
  }

  if (!participants) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-lg">
          {t("contest.staff.participants.noneFound")}
        </div>
      </div>
    );
  }

  return (
    <>
      {isQRFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setIsQRFullscreen(false)}
        >
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 md:max-w-md">
            {qrCode ? (
              <QRCode
                className="h-96 w-96 rounded-lg border-4 border-tertiary p-2"
                value={qrCode}
              />
            ) : (
              <div className="flex h-96 w-96 items-center justify-center rounded-lg border-4 border-tertiary p-2">
                <div className="text-center text-lg text-gray-700">
                  {t("contest.staff.qrCode.notAvailable")}
                </div>
              </div>
            )}
            <div className="flex flex-col items-center gap-2 text-center text-lg text-gray-700">
              <span className="w-full break-words">
                {tFR("contest.staff.qrCode.scanInstructions")}
              </span>
              <hr className="w-1/2 border-black/30" />
              <span className="w-full break-words">
                {tEN("contest.staff.qrCode.scanInstructions")}
              </span>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-6 p-6">
        <h1 className="text-2xl font-bold">{t("contest.staff.title")}</h1>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex flex-col items-center space-y-4">
            <h2 className="text-xl font-semibold">
              {t("contest.staff.qrCode.title")}
            </h2>
            {qrCode && (
              <div
                onClick={() => setIsQRFullscreen(true)}
                className="cursor-pointer transition-opacity hover:opacity-80"
              >
                <QRCode
                  className="rounded-lg border-4 border-tertiary p-2"
                  value={qrCode}
                />
                <p className="text-center text-sm text-gray-500">
                  {t("contest.staff.qrCode.clickToEnlarge")}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t("contest.staff.participants.title")} (
              <ParticipantCount count={participants.length} />)
            </h2>
            <ul className="max-h-96 space-y-0.5 overflow-y-auto">
              {participants.map((participant) => (
                <li
                  key={participant.$id}
                  className="rounded text-gray-700 hover:bg-gray-50"
                >
                  {participant.name}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDrawWinner}
            className="rounded-lg bg-success-orange px-4 py-2 text-black transition-colors hover:bg-success-orange/80"
          >
            {t("contest.staff.actions.drawWinner")}
          </button>
          <button
            onClick={sendNotification}
            className="rounded-lg bg-secondary px-4 py-2 text-black transition-colors hover:bg-secondary/80"
          >
            {t("contest.staff.actions.sendNotification")}
          </button>
        </div>
      </div>
    </>
  );
}

function ParticipantCount({ count }: { count: number }) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [count]);

  return (
    <span
      className={clsx(
        "transition-colors duration-300",
        isAnimating && "text-success-orange",
      )}
    >
      {count}
    </span>
  );
}
