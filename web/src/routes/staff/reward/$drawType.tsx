import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint } from "lucide-react";
import { useState } from "react";

import envelopeClosed from "@/assets/envelope_closed.png";
import envelopeOpen from "@/assets/envelope_open.png";
import { useDrawReward } from "@/lib/hooks/useDrawReward.ts";
import { Prize, RewardDrawType, isRewardDrawType } from "@/lib/rewards.ts";

export const Route = createFileRoute("/staff/reward/$drawType")({
  component: RouteComponent,
});

function RouteComponent() {
  const { drawType } = Route.useParams();

  if (!isRewardDrawType(drawType)) {
    throw new TypeError("Draw type is invalid");
  }

  const [phase, setPhase] = useState<RewardDrawType>("standard");
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [wonPrize, setWonPrize] = useState<Prize>();
  const { drawReward, isLoading } = useDrawReward();

  const handleClosedEnvelopeClick = () => {
    if (isLoading) {
      console.log("chotto matte");
      return;
    }
    setAnimationStep(1);
    setWonPrize(drawReward(phase));
  };

  return (
    <>
      <p className="text-center font-extrabold text-gray-300">
        Reward type: {drawType}
      </p>
      {animationStep === 0 && (
        <div
          className="fixed bottom-5 left-0 flex w-full flex-col items-center justify-center p-2"
          onClick={handleClosedEnvelopeClick}
        >
          <p className="font-extrabold">
            <Fingerprint className="inline-block align-middle" /> Reward inside
          </p>
          <img
            className="mt-[48px] max-w-[80vw] animate-envelope-wiggle direction-alternate repeat-infinite"
            alt="Reward envelope, sealed with the event logo."
            src={envelopeClosed}
          />
        </div>
      )}
      {animationStep > 0 && (
        <div
          className="fixed bottom-5 left-0 flex w-full flex-col items-center justify-center p-2"
          onAnimationEnd={console.log}
        >
          <img
            className="max-w-[80vw] origin-center animate-envelope-send-to-center fill-mode-forwards"
            alt="Reward envelope, sealed with the event logo."
            src={envelopeClosed}
          />
        </div>
      )}
    </>
  );
}
