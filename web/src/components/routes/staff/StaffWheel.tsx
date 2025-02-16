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
          <span className="break-words w-full">{tFR("wheelOfFortune")}</span>
          <hr className="w-full border-black/30 my-2" />
          <span className="break-words w-full">{tEN("wheelOfFortune")}</span>
        </div>
      </Header>

      <div className="relative flex flex-col justify-center items-center">
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
                className="absolute flex justify-center items-center w-full h-full z-10"
                onClick={() => setWinner(null)}
              >
                <div className="text-white animate-in rounded-xl flex items-center text-xl p-4 w-full bg-background-black">
                  <div className="p-2 rounded-sm mx-auto">
                    <p>🎉 {winner} !</p>
                  </div>
                </div>
              </div>
            )}
            {shouldShowSpinButton && (
              <div
                className="absolute flex justify-center items-center w-full h-full z-10"
                onClick={determineWinnerAndStartSpinning}
              >
                <div className="text-white animate-in rounded-xl flex items-center text-xl p-4 w-[50%] cursor-pointer bg-background-black">
                  <div className="p-2 rounded-sm mx-auto">
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
