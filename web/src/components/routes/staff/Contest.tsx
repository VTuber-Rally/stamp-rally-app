import clsx from "clsx";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import QRCode from "react-qr-code";

import { Checkbox } from "@/components/inputs/Checkbox";
import { useContestDrawWinner } from "@/lib/hooks/contest/useContestDrawWinner";
import { useContestParticipants } from "@/lib/hooks/contest/useContestParticipants";
import { useContestQRCode } from "@/lib/hooks/contest/useContestQRCode";
import { useContestWinners } from "@/lib/hooks/contest/useContestWinners";

export default function Contest() {
  const [filterRecentParticipants, setFilterRecentParticipants] =
    useState(false);
  const {
    data: participants,
    isLoading: areParticipantsLoading,
    error,
  } = useContestParticipants(filterRecentParticipants);
  const {
    drawWinner,
    resetDraw,
    updateWinner,
    updateDayDrawn,
    isWinnerDrawn,
    isDrawing,
    countdown,
    isDrumRoll,
    winner,
  } = useContestDrawWinner(participants);
  const { data: qrCode, isLoading: isQRCodeLoading } = useContestQRCode();
  const { data: winners, isLoading: areWinnersLoading } = useContestWinners();
  const [isQRFullscreen, setIsQRFullscreen] = useState(false);
  const { t } = useTranslation();
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });

  const handleDrawWinner = async () => {
    await drawWinner();
  };

  const handleValidateWinner = async () => {
    await updateWinner();
    await updateDayDrawn();

    setTimeout(() => {
      resetDraw();
    }, 1000);
  };

  const sendNotification = async () => {
    // TODO
  };

  if (areParticipantsLoading && isQRCodeLoading) {
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

      {isWinnerDrawn && winner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center gap-4 rounded-lg bg-white p-8 md:max-w-md">
            <h2 className="text-xl font-semibold">
              {t("contest.staff.winner.title")}
            </h2>
            <p className="text-4xl font-bold text-success-orange">
              {winner.name}
            </p>
            <button
              onClick={handleValidateWinner}
              className="rounded-lg bg-success-orange px-4 py-2 text-black transition-colors hover:bg-success-orange/80"
            >
              {t("contest.staff.actions.validateWinner")}
            </button>
            <button
              onClick={resetDraw}
              className="rounded-lg bg-gray-200 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-300"
            >
              {t("contest.staff.actions.resetDraw")}
            </button>
          </div>
        </div>
      )}

      {isDrawing && countdown && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8">
            <div className="animate-bounce text-8xl font-bold text-success-orange">
              {countdown}
            </div>
            <div className="text-xl text-gray-700">
              {t("contest.staff.drawing.inProgress")}
            </div>
          </div>
        </div>
      )}

      {isDrumRoll && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-white p-8">
            <div className="flex space-x-2">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-4 w-4 animate-bounce rounded-full bg-success-orange"
                  style={{ animationDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <div className="text-xl text-gray-700">
              {t("contest.staff.drawing.drumRoll")}
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
              <ParticipantCount count={participants?.length ?? 0} />)
            </h2>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={filterRecentParticipants}
                onCheckedChange={() => {
                  setFilterRecentParticipants(!filterRecentParticipants);
                }}
              />
              <label htmlFor="filterRecentParticipants">
                {t("contest.staff.participants.showRecent")}
              </label>
            </div>
            {participants && (
              <>
                {participants.length == 0 && (
                  <p className="text-center text-gray-500">
                    {t("contest.staff.participants.noneFound")}
                  </p>
                )}
                {areParticipantsLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader className="h-6 w-6 animate-spin text-gray-400" />
                  </div>
                )}
                <ul className="max-h-96 space-y-0.5 overflow-y-auto">
                  <>
                    {participants.map((participant) => (
                      <li
                        key={participant.$id}
                        className="rounded text-gray-700 hover:bg-gray-50"
                      >
                        {participant.name}
                      </li>
                    ))}
                  </>
                </ul>
              </>
            )}
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          <button
            onClick={handleDrawWinner}
            disabled={isDrawing || isWinnerDrawn || participants?.length == 0}
            className="rounded-lg bg-success-orange px-4 py-2 text-black transition-colors hover:bg-success-orange/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("contest.staff.actions.drawWinner")}
          </button>
          <button
            onClick={sendNotification}
            disabled={participants?.length == 0}
            className="rounded-lg bg-secondary px-4 py-2 text-black transition-colors hover:bg-secondary/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t("contest.staff.actions.sendNotification")}
          </button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">
              {t("contest.staff.winners.title")} ({winners?.length ?? 0})
            </h2>
            {areWinnersLoading ? (
              <div className="flex items-center justify-center py-4">
                <Loader className="h-6 w-6 animate-spin text-gray-400" />
              </div>
            ) : winners && winners.length > 0 ? (
              <ul className="space-y-2">
                {winners.map((winner) => (
                  <li
                    key={winner.$id}
                    className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                  >
                    <span className="font-medium">{winner.name}</span>
                    <span className="text-sm text-gray-500">
                      {winner.drawnDate &&
                        new Date(winner.drawnDate).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">
                {t("contest.staff.winners.noneFound")}
              </p>
            )}
          </div>
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
