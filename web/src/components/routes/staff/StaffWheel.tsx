import { useState } from "react";
import { Wheel as WheelComponent } from "react-custom-roulette";
import { useTranslation } from "react-i18next";

import { Header } from "@/components/Header.tsx";
import Loader from "@/components/Loader.tsx";
import { useWheelEntries } from "@/lib/hooks/useWheelEntries.ts";

function Wheel() {
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });

  const { data: segments, isLoading } = useWheelEntries();

  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];

  const [winner, setWinner] = useState<string | null>(null);
  const [winningSegment, setWinningSegment] = useState<number>(0);

  const onFinished = () => {
    if (!segments || !segments[winningSegment]) {
      console.error("could not determine winner");
      return;
    }

    setWinner(segments[winningSegment].option);
    setShouldStartSpinning(false);
  };

  const determineWinnerAndStartSpinning = () => {
    if (!segments) return;

    const totalProbability = segments.reduce(
      (acc, seg) => acc + seg.probability,
      0,
    );
    const random = Math.random() * totalProbability;
    let currentProbability = 0;
    let winner = null;
    for (const seg of segments) {
      currentProbability += seg.probability;
      if (random <= currentProbability) {
        // find index of segment
        winner = segments.findIndex((s) => s.option === seg.option);
        break;
      }
    }
    if (winner === null) {
      console.error("could not determine winner");
      return;
    }

    setWinningSegment(winner);
    setShouldStartSpinning(true);
  };

  const [shouldStartSpinning, setShouldStartSpinning] = useState(false);

  const shouldShowSpinButton = !shouldStartSpinning && segments && !winner;

  return (
    <>
      <Header>
        <div className={"flex flex-col"}>
          <span className="w-full break-words">{tFR("wheelOfFortune")}</span>
          <hr className="my-2 w-full border-black/30" />
          <span className="w-full break-words">{tEN("wheelOfFortune")}</span>
        </div>
      </Header>

      <div className="relative flex flex-col items-center justify-center">
        {isLoading && (
          <div className={"flex flex-col items-center"}>
            <Loader size={4} />
            <div>{tFR("loading")}</div>
            <div>{tEN("loading")}</div>
          </div>
        )}
        {segments && (
          <>
            <WheelComponent
              mustStartSpinning={shouldStartSpinning}
              prizeNumber={winningSegment}
              data={segments}
              spinDuration={1}
              fontFamily={"Comfortaa Variable"}
              backgroundColors={segColors}
              textColors={["#ffffff"]}
              onStopSpinning={() => onFinished()}
            />
            {winner && (
              <div
                className="absolute z-10 flex h-full w-full items-center justify-center"
                onClick={() => setWinner(null)}
              >
                <div className="flex w-full items-center rounded-xl bg-background-black p-4 text-xl text-white animate-in">
                  <div className="mx-auto rounded-sm p-2">
                    <p>🎉 {winner} !</p>
                  </div>
                </div>
              </div>
            )}
            {shouldShowSpinButton && (
              <div
                className="absolute z-10 flex h-full w-full items-center justify-center"
                onClick={determineWinnerAndStartSpinning}
              >
                <div className="flex w-[50%] cursor-pointer items-center rounded-xl bg-background-black p-4 text-xl text-white animate-in">
                  <div className="mx-auto rounded-sm p-2">
                    <p>Spin !</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}

export default Wheel;
