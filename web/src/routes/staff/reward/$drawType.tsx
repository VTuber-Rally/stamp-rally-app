import { useConfetti } from "@stevent-team/react-party";
import { createFileRoute } from "@tanstack/react-router";
import { zodValidator } from "@tanstack/zod-adapter";
import clsx from "clsx";
import { Sparkles, Vote } from "lucide-react";
import { LegacyRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";

import envelopeClosed from "@/assets/envelope_closed.png";
import envelopeOpen from "@/assets/envelope_open.png";
import gestureTapHold from "@/assets/gesture-tap-hold.svg";
import horizontalCards from "@/assets/horizontal_cards.webp";
import { useDrawReward } from "@/lib/hooks/useDrawReward.ts";
import { Prize, RewardDrawType, isRewardDrawType } from "@/lib/rewards.ts";
import { rewardDrawSearchParamsSchema } from "@/searchParams.ts";

export const Route = createFileRoute("/staff/reward/$drawType")({
  component: RouteComponent,
  validateSearch: zodValidator(rewardDrawSearchParamsSchema),
});

function RouteComponent() {
  const { t: tFR } = useTranslation("", { lng: "fr" });
  const { t: tEN } = useTranslation("", { lng: "en" });
  const { drawType } = Route.useParams();
  const { submissionId } = Route.useSearch();
  const navigate = Route.useNavigate();

  if (!isRewardDrawType(drawType)) {
    throw new TypeError("Draw type is invalid");
  }

  const [phase, setPhase] = useState<RewardDrawType>("standard");
  const [animationStep, setAnimationStep] = useState<number>(0);
  const [wonClassicCards, setWonClassicCards] = useState<number>(0);
  const [wonHolographicCards, setWonHolographicCards] = useState<number>(0);
  const [wonReward, setWonReward] = useState<Prize>();
  const { drawReward, isLoading } = useDrawReward();

  const { createConfetti, canvasProps } = useConfetti({
    count: 75,
    duration: 100,
    speed: 2,
  });

  const handleClosedEnvelopeClick = () => {
    if (isLoading) {
      return;
    }
    const reward = drawReward(phase);
    if (!reward) {
      throw new Error("Can't find any reward");
    }
    setWonReward(reward);
    setAnimationStep(1);
  };

  const goToNextAnimationStep = () => {
    setAnimationStep((currentAnimationStep) => {
      if (currentAnimationStep === 2) {
        void createConfetti();
        if (!wonReward) {
          throw new Error("Reward was not drawn");
        }
        setWonClassicCards(wonClassicCards + wonReward.classicCards);
        setWonHolographicCards(
          wonHolographicCards + wonReward.holographicCards,
        );
      }
      return currentAnimationStep + 1;
    });
  };

  const canGoToNextPhase = phase === "standard" && drawType === "premium";

  const goToNextPhase = () => {
    if (canGoToNextPhase) {
      setPhase("premium");
      setAnimationStep(0);
    } else {
      void navigate({
        to: "/staff/inventory",
        search: {
          maxClassicCards: wonClassicCards,
          maxHoloCards: wonHolographicCards,
          submissionId,
        },
      });
    }
  };

  return (
    <>
      <p className="text-center font-extrabold text-gray-300">
        <Trans
          t={tEN}
          components={{
            br: <br />,
          }}
          i18nKey="draw.debug"
          values={{
            type: drawType,
            phase,
            wonClassicCards,
            wonHolographicCards,
          }}
        />
      </p>
      {animationStep === 0 && (
        <div
          className="fixed bottom-5 left-0 flex w-full flex-col items-center justify-center p-2"
          onClick={handleClosedEnvelopeClick}
        >
          <p className="text-center font-extrabold">
            <img
              src={gestureTapHold}
              className="inline-block h-8 align-bottom"
            />{" "}
            {tEN("draw.drawReward")} / {tFR("draw.drawReward")}
          </p>
          <img
            className="mt-[48px] max-w-[80vw] animate-envelope-wiggle direction-alternate repeat-infinite"
            src={envelopeClosed}
          />
        </div>
      )}
      {animationStep > 0 && (
        <>
          <div
            className={clsx(
              "fixed bottom-5 left-0 flex w-full flex-col items-center justify-center p-2",
              animationStep > 1 && "animate-disappear fill-mode-forwards",
            )}
          >
            <img
              className={clsx(
                "max-w-[80vw] origin-center",
                animationStep === 1 &&
                  "animate-envelope-send-to-center fill-mode-forwards",
                animationStep === 2 &&
                  "animate-envelope-shake direction-alternate repeat-infinite",
              )}
              src={envelopeClosed}
              onAnimationEnd={goToNextAnimationStep}
            />
          </div>

          <div
            className={clsx(
              "fixed bottom-50 left-0 flex w-full flex-col items-center justify-center gap-2 p-2",
              "opacity-0",
              animationStep >= 2 && "animate-appear fill-mode-forwards",
            )}
            onClick={goToNextPhase}
          >
            {!!wonReward?.classicCards && (
              <>
                <div className="text-5xl font-extrabold">
                  <Vote className="inline-block align-sub" size={64} />{" "}
                  {wonReward.classicCards}
                </div>
                <div className="text-center text-xs text-gray-500">
                  {tFR("draw.classicCards", { count: wonReward.classicCards })}{" "}
                  /{" "}
                  {tEN("draw.classicCards", { count: wonReward.classicCards })}
                </div>
              </>
            )}
            {!!wonReward?.holographicCards && (
              <>
                <div className="text-5xl font-extrabold">
                  <Sparkles className="inline-block align-sub" size={64} />{" "}
                  {wonReward?.holographicCards}
                </div>
                <div className="text-center text-xs text-gray-500">
                  {tFR("draw.holographicCards", {
                    count: wonReward.holographicCards,
                  })}{" "}
                  /{" "}
                  {tEN("draw.holographicCards", {
                    count: wonReward.holographicCards,
                  })}
                </div>
              </>
            )}
            <img className={clsx("max-w-[80vw]")} src={envelopeOpen} />
            {canGoToNextPhase && (
              <p className="text-center text-xs text-gray-600">
                {tFR("draw.goToNextPhase")} / {tEN("draw.goToNextPhase")}
              </p>
            )}
          </div>
        </>
      )}
      {animationStep === 2 && (
        <div
          className="fixed bottom-0 -left-full flex h-full w-[300vw] flex-col items-center justify-center p-2"
          onAnimationEnd={goToNextAnimationStep}
        >
          <img
            className="animate-cards-swipe fill-mode-forwards"
            src={horizontalCards}
          />
        </div>
      )}
      <canvas
        ref={canvasProps.ref as LegacyRef<HTMLCanvasElement> | null}
        className="pointer-events-none absolute inset-0 block h-full w-full"
      />
    </>
  );
}
